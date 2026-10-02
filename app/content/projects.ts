import type { Project } from "./types";

// Every repository URL below was verified to return HTTP 200. CI re-checks this,
// so a repository that is renamed, made private, or deleted fails the build
// rather than shipping a dead link.
//
// `featured` marks the curated selection shown on the home page. Unfeatured
// entries are still built and reachable by their detail URL.
export const projects: Project[] = [
  {
    slug: "system-design-primer",
    title: "System Design Primer",
    summary:
      "Design notes covering scalability, consistency trade-offs, caching, and interview-style system designs.",
    status: "in-progress",
    featured: true,
    tags: ["Distributed Systems", "Scalability", "Documentation"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/system-design-primer",
      },
    ],
    body: [
      "A personal reference for the design questions I get asked repeatedly: what to do when a single database becomes the bottleneck, and how to reason about CAP in practice rather than in the abstract.",
      "Kept current with worked examples drawn from services I have actually run.",
    ],
  },
  {
    slug: "fork-system-design-notes",
    title: "System Design Notes",
    summary:
      "Personal design notes and diagrams covering data stores, queues, replication, and failure handling.",
    status: "in-progress",
    featured: true,
    tags: ["System Design", "Databases", "Architecture"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/fork-system-design-notes",
      },
    ],
    body: [
      "A second, more narrative set of design notes, focused on the decisions and their trade-offs rather than on definitions.",
      "Grows as I encounter problems worth writing down.",
    ],
  },
  {
    slug: "machine-learning-systems-design",
    title: "Machine Learning Systems Design",
    summary:
      "Notes on designing and operating machine learning systems, from feature pipelines to serving and monitoring.",
    status: "in-progress",
    featured: true,
    tags: ["MLOps", "Python", "Architecture"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/machine-learning-systems-design",
      },
    ],
    body: [
      "Design notes covering the operational side of machine learning: how data reaches the model, how predictions are served, and how drift gets noticed before users report it.",
    ],
  },
  {
    slug: "java-concurrency-algorithms",
    title: "Java Concurrency Algorithms",
    summary:
      "Concurrency patterns and worked examples in Java, from thread lifecycles to non-blocking data structures.",
    status: "completed",
    featured: true,
    tags: ["Java", "Concurrency", "JVM"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/java_concurrency_algorithms",
      },
    ],
    body: [
      "Thread lifecycle, executor configuration, lock strategies, and the concurrent collections that come with the JDK.",
      "Written as small runnable examples so each pattern can be executed rather than only read.",
    ],
  },
  {
    slug: "ms-config-server",
    title: "Spring Cloud Config Server",
    summary:
      "A centralised configuration server for Spring Boot services, backed by encrypted Git storage.",
    status: "completed",
    featured: true,
    tags: ["Spring Boot", "Spring Cloud", "Configuration"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/ms-config-server",
      },
    ],
    body: [
      "Centralises configuration so environments stay reproducible and secrets never live in a service's own source tree.",
      "Demonstrates refresh scopes so a configuration change can be picked up without a full restart.",
    ],
  },
  {
    slug: "pluralsight-spring-cloud-configserver",
    title: "Spring Cloud Config Server Walkthrough",
    summary:
      "A guided implementation of a Spring Cloud Config Server, covering clients, profiles, and decryption.",
    status: "completed",
    featured: true,
    tags: ["Spring Cloud", "Java", "Configuration"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/pluralsight-spring-cloud-configserver",
      },
    ],
    body: [
      "A step-by-step companion to the config server pattern, kept because it explains the moving parts in the order they actually matter.",
    ],
  },
  {
    slug: "data-sync",
    title: "Data Sync Infrastructure",
    summary:
      "Terraform and pipeline definitions for synchronising data across environments and accounts.",
    status: "in-progress",
    featured: true,
    tags: ["Terraform", "AWS", "Data Pipelines"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/data-sync",
      },
    ],
    body: [
      "Reproducible infrastructure for moving data between environments and accounts without hand-run scripts.",
      "Terraform-first, so the environment is describable rather than remembered.",
    ],
  },
  {
    slug: "airflow",
    title: "Apache Airflow Pipelines",
    summary:
      "Scheduled data orchestration with Airflow, covering DAG structure, retries, and backfills.",
    status: "completed",
    featured: true,
    tags: ["Airflow", "Python", "Orchestration"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/airflow",
      },
    ],
    body: [
      "DAGs built around explicit retry policy and idempotent tasks, so a failed run can be re-run without duplicating work.",
    ],
  },
  {
    slug: "registry-app",
    title: "Service Registry Application",
    summary:
      "A JavaScript service registry frontend for looking up, registering, and comparing deployed services.",
    status: "completed",
    featured: true,
    tags: ["JavaScript", "Registry", "Frontend"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/registry-app",
      },
    ],
    body: [
      "A small registry UI that makes the state of deployed services visible at a glance, which is the first step to not being surprised by one of them.",
    ],
  },
  {
    slug: "web-to-pdf",
    title: "Web to PDF Converter",
    summary:
      "A utility that renders web pages to PDF, used for producing readable snapshots of long documentation.",
    status: "completed",
    featured: true,
    tags: ["Python", "Automation", "Documents"],
    links: [
      {
        label: "Repository",
        url: "https://github.com/dibasbehera7/web-to-pdf",
      },
    ],
    body: [
      "Built to turn sprawling documentation into something I can read offline and annotate.",
      "Handles pagination and link preservation so the PDF stays navigable.",
    ],
  },
];

/**
 * The curated set shown on the home page. Everything else stays reachable by its
 * detail URL but is not listed on the landing page.
 */
export const featuredProjects: Project[] = projects.filter(
  (project) => project.featured,
);