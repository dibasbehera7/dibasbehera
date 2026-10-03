import { serveStatic } from "./lighthouse-gate.mjs";
import { launch } from "chrome-launcher";

/*
 * Browser-level checks that Lighthouse's category scores do not cover:
 *  - horizontal overflow at a 320px viewport (WCAG reflow)
 *  - Content-Security-Policy violations in the console, including after the
 *    booking embed is activated
 *
 * Plain ESM on purpose: a TS transform breaks Lighthouse's injected script.
 */

const WIDTH = 320;
const HEIGHT = 800;
const PAGES = ["/", "/book/"];

async function connect(port) {
  const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) =>
    r.json(),
  );
  const page = targets.find((target) => target.type === "page");
  if (!page) throw new Error("No page target available");

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 1;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  });

  function send(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve) => {
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  return { socket, send };
}

const consoleMessages = [];

function collectConsole(message) {
  if (message.method !== "Runtime.consoleAPICalled") return;

  const text = (message.params.args ?? [])
    .map((arg) => arg.value ?? arg.description ?? "")
    .join(" ");

  consoleMessages.push(text);
}

function collectLogEntries(message) {
  if (message.method !== "Log.entryAdded") return;
  consoleMessages.push(message.params.entry.text ?? "");
}

async function main() {
  const { origin, prefix, close } = await serveStatic();
  const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
  const failures = [];

  try {
    const { socket, send } = await connect(chrome.port);

    await send("Runtime.enable");
    await send("Log.enable");
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: 1,
      mobile: true,
    });

    socket.addEventListener("message", collectConsole);
    socket.addEventListener("message", collectLogEntries);

    for (const path of PAGES) {
      consoleMessages.length = 0;

      await send("Page.navigate", { url: `${origin}${prefix}${path}` });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await send("Runtime.evaluate", {
        expression: `JSON.stringify({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content ?? null
        })`,
        returnByValue: true,
      });

      const metrics = JSON.parse(result.result.result.value);

      const overflow = metrics.scrollWidth > metrics.innerWidth + 1;
      console.log(
        `  ${overflow ? "FAIL" : "PASS"} ${path} no horizontal overflow at ${WIDTH}px (content ${metrics.scrollWidth}px, viewport ${metrics.innerWidth}px)`,
      );

      if (overflow) {
        failures.push(`${path} overflows horizontally at ${WIDTH}px`);
      }

      if (!metrics.csp) {
        failures.push(`${path} has no Content-Security-Policy meta tag`);
      }

      const cspViolations = consoleMessages.filter((text) =>
        /content security policy|refused to (load|execute|apply|connect|frame)/i.test(text),
      );

      console.log(
        `  ${cspViolations.length === 0 ? "PASS" : "FAIL"} ${path} no CSP violations`,
      );

      if (cspViolations.length > 0) {
        failures.push(`${path} CSP violations: ${cspViolations[0].slice(0, 160)}`);
      }

      // Activate the booking embed so the third-party origin is exercised.
      if (path === "/book/") {
        await send("Runtime.evaluate", {
          expression: `document.querySelector('button[aria-label*="Open the booking calendar" i]')?.click()`,
        });
        await new Promise((resolve) => setTimeout(resolve, 2500));

        const embedViolations = consoleMessages.filter((text) =>
          /content security policy|refused to/i.test(text),
        );

        console.log(
          `  ${embedViolations.length === 0 ? "PASS" : "FAIL"} /book/ no CSP violations after activating the embed`,
        );

        if (embedViolations.length > 0) {
          failures.push(
            `/book/ CSP violations after embed: ${embedViolations[0].slice(0, 160)}`,
          );
        }
      }
    }

    socket.close();
  } finally {
    await chrome.kill();
    await close();
  }

  if (failures.length > 0) {
    console.error("\nBrowser checks failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log("\nBrowser checks passed.");
}

const invokedDirectly = process.argv[1]?.endsWith("check-browser.mjs");

if (invokedDirectly) {
  void main();
}