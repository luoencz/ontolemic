import Link from "next/link";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "../data";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

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
            {project.tags.length > 0 && (
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

