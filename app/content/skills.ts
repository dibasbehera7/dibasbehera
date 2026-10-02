import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["Java", "Python", "SQL", "Bash"],
  },
  {
    category: "Backend",
    skills: [
      "Spring Boot",
      "Spring Cloud",
      "REST APIs",
      "Microservices",
      "JPA / Hibernate",
    ],
  },
  {
    category: "Cloud and Infrastructure",
    skills: ["AWS", "Terraform", "Kubernetes", "Helm", "Ansible", "Docker"],
  },
  {
    category: "Data and Messaging",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Apache Kafka", "Airflow"],
  },
  {
    category: "Operations",
    skills: ["Prometheus", "Grafana", "CI/CD", "Linux"],
  },
];