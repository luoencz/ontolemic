import Link from "next/link";
import styles from "./page.module.css";

// Example projects data
const projects = [
  {
    slug: "project-one",
    title: "Project One",
    description: "A brief description of the first project goes here.",
    image: "/images/svgs/analemma.svg", // Using existing image as placeholder
  },
  {
    slug: "project-two",
    title: "Project Two",
    description: "A brief description of the second project goes here.",
    image: "/images/svgs/analemma.svg", // Using existing image as placeholder
  },
];

export default function Projects() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Projects</h1>
        <div className={styles.grid}>
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/project/${project.slug}`}
              className={styles.card}
            >
              <div className={styles.imageContainer}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={styles.image}
                />
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{project.title}</h2>
                <p className={styles.cardDescription}>{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

