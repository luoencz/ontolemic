import Link from "next/link";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

// Example projects data - in a real app, this would come from a CMS or database
const projects: Record<string, { title: string; description: string; image: string }> = {
  "project-one": {
    title: "Project One",
    description: "A brief description of the first project goes here.",
    image: "/images/svgs/analemma.svg",
  },
  "project-two": {
    title: "Project Two",
    description: "A brief description of the second project goes here.",
    image: "/images/svgs/analemma.svg",
  },
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <Link href="/project" className={styles.backLink}>
          ← Back to Projects
        </Link>
        <div className={styles.project}>
          <div className={styles.imageContainer}>
            <img
              src={project.image}
              alt={project.title}
              className={styles.image}
            />
          </div>
          <div className={styles.projectContent}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.description}>{project.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

