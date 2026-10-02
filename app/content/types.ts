export const PROJECT_STATUSES = ["completed", "in-progress"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  /** Stable URL segment for the project detail page. */
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  tags: string[];
  links: ProjectLink[];
  /** Long-form description shown on the project detail page. */
  body: string[];
  /**
   * Whether the project appears on the home page. Only a curated selection is
   * featured; the rest stay reachable by URL.
   */
  featured?: boolean;
}

export interface PrepItem {
  title: string;
  topics: string[];
  links: ProjectLink[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  domain: string;
  period: string;
  technologies: string[];
  highlights: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface BookingConfig {
  provider: "cal";
  /** Cal.com account handle. */
  handle: string;
  /** Optional Cal.com event type slug; omit to use the account page. */
  eventTypeSlug?: string;
  sessionName: string;
  durationMinutes: number;
  price: number;
  currency: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  introduction: string;
  email: string;
  profiles: ProjectLink[];
  booking: BookingConfig;
}