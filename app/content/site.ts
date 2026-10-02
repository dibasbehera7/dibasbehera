import type { SiteConfig } from "./types";

export const site: SiteConfig = {
  name: "Dibas Behera",
  role: "Software Engineer",
  tagline: "Backend and cloud engineering, with a habit of shipping.",
  introduction:
    "I build distributed Java and Spring Boot services and the AWS infrastructure that runs them. Most of my work lives in Kubernetes, Terraform, and observability tooling. This site collects what I have shipped, what I am currently building, and how to reach me.",
  email: "dibasbehera@gmail.com",
  profiles: [
    { label: "GitHub", url: "https://github.com/dibasbehera7" },
  ],
  booking: {
    provider: "cal",
    handle: "dibasbehera",
    sessionName: "1:1 Engineering Session",
    durationMinutes: 45,
    price: 49,
    currency: "USD",
  },
};