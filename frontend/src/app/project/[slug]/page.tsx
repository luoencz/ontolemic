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
    <main className="page-main">
      <div className={styles.content}>
        <Link href="/project" className={styles.backLink}>
          ← Back to Projects
        </Link>
        <div className={styles.project}>
          <div className="image-container-tall">
            <img
              src={project.image}
              alt={project.title}
              className="image-cover"
            />
          </div>
          <div className={styles.projectContent}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 400, margin: 0 }}>{project.title}</h1>
            <p style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-relaxed)', opacity: 'var(--opacity-muted)' }}>{project.description}</p>
            {project.tags.length > 0 && (
              <div className="tags-container" style={{ marginTop: 'var(--spacing-sm)' }}>
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
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

