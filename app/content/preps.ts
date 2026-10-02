import type { PrepItem } from "./types";

// Preparation material only. No repository here may also appear in
// app/content/projects.ts, so the two sections never show the same content.
export const interviewPreps: PrepItem[] = [
  {
    title: "LeetCode Patterns",
    topics: ["Two Pointers", "Sliding Window", "Graphs", "Intervals"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-leetcode-patterns",
      },
    ],
  },
  {
    title: "DSA Practice Kit",
    topics: ["Arrays", "Trees", "Heaps", "Practice Sets"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-DSA-KIT",
      },
    ],
  },
  {
    title: "Java 8 Interview Questions",
    topics: ["Streams", "Functional Interfaces", "Optional", "CompletableFuture"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/InterviewQuestionJava8Features",
      },
    ],
  },
  {
    title: "Low Level Design Notes",
    topics: ["SOLID", "Design Patterns", "Concurrency Patterns", "Caching"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-awesome-low-level-design",
      },
    ],
  },
  {
    title: "System Design Resources",
    topics: ["Papers", "Case Studies", "Books", "Talks"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-awesome-system-design-resources",
      },
    ],
  },
  {
    title: "System Design Interview Practice",
    topics: ["URL Shortener", "Rate Limiter", "News Feed", "Design Review"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/system-design-interview",
      },
    ],
  },
  {
    title: "System Design 101",
    topics: ["Fundamentals", "Load Balancing", "Databases", "Queues"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/system-design-101",
      },
    ],
  },
  {
    title: "IT Certification Practice",
    topics: ["Networking", "Security", "Linux", "Automation"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/it-cert-automation-practice",
      },
    ],
  },
  {
    title: "Authorization Deep Dives",
    topics: ["OAuth", "JWT", "Scopes", "Threat Modelling"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-authorization-yt-companion",
      },
    ],
  },
  {
    title: "Spring Boot with AI",
    topics: ["Spring AI", "Prompt Design", "Tool Calling", "Evaluation"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-claude-ai-spring-boot",
      },
    ],
  },
];