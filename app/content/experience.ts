import type { ExperienceEntry } from "./types";

// TODO(owner): replace with the owner's real roles before publishing.
export const experience: ExperienceEntry[] = [
  {
    company: "Backend and Cloud Engineering",
    role: "Software Engineer",
    domain: "Financial services and developer tooling",
    period: "2021 - Present",
    technologies: ["Java", "Spring Boot", "AWS", "Kubernetes", "Terraform"],
    highlights: [
      "Build and operate Java and Spring Boot services on AWS, deployed through Kubernetes with Helm.",
      "Own infrastructure as code with Terraform and keep environments reproducible across accounts.",
      "Instrument services with Prometheus and Grafana so regressions surface before customers report them.",
    ],
  },
  {
    company: "Independent Learning and Publishing",
    role: "Author and maintainer",
    domain: "System design and concurrency",
    period: "2022 - Present",
    technologies: ["Distributed Systems", "Java", "Spring Boot"],
    highlights: [
      "Write and maintain public notes on system design, concurrency, and Spring internals.",
      "Publish reference material and practice problems that thousands of developers use.",
    ],
  },
];