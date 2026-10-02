import "@testing-library/jest-dom/vitest";

// jsdom does not implement the modal behaviour of <dialog>. This shim is test
// infrastructure only; real browsers use the native implementation.
if (typeof HTMLDialogElement !== "undefined") {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>;

  if (typeof proto.showModal !== "function") {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };

    proto.show = function show(this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };

    proto.close = function close(this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
}