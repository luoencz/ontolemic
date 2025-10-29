import styles from "./page.module.css";
import { projects, getAllTags } from "./data";
import ProjectsClient from "./client";

export default function Projects() {
  const allTags = getAllTags();

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Projects</h1>
        <ProjectsClient projects={projects} allTags={allTags} />
      </div>
    </main>
  );
}

