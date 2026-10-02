import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { InterviewPreps } from "@/components/InterviewPreps";
import { Intro } from "@/components/Intro";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Skills } from "@/components/Skills";
import { TopBar } from "@/components/TopBar";
import { experience } from "@/content/experience";
import { interviewPreps } from "@/content/preps";
import { featuredProjects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { site } from "@/content/site";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <div className={styles.waves} aria-hidden="true">
        <span className={`${styles.waveBlob} ${styles.waveBlobTopLeft}`} />
        <span className={`${styles.waveBlob} ${styles.waveBlobRight}`} />
        <span className={`${styles.waveBlob} ${styles.waveBlobBottom}`} />
      </div>

      <TopBar site={site} />

      <main>
        <Intro site={site} />
        <ProjectShowcase projects={featuredProjects} />
        <InterviewPreps items={interviewPreps} />
        <Skills skillGroups={skillGroups} />
        <Experience experience={experience} />
        <Contact />
      </main>

      <Footer site={site} />
    </>
  );
}