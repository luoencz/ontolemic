"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import styles from "./page.module.css";
import { Project } from "./data";

interface ProjectsClientProps {
  projects: Project[];
  allTags: string[];
}

export default function ProjectsClient({ projects, allTags }: ProjectsClientProps) {
  const pathname = usePathname();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return projects;
    }
    return projects.filter((project) =>
      project.tags.some((tag) => selectedTags.includes(tag))
    );
  }, [selectedTags, projects]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <>
      {/* Tag Filter Section */}
      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`button-filter ${
                selectedTags.includes(tag) ? "button-filter-active" : ""
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={clearFilters}
            className="button-clear"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Project Grid */}
      <div className={styles.grid}>
        {filteredProjects.map((project) => {
          const isActive = pathname.startsWith(`/project/${project.slug}`);
          return (
            <Link
              key={project.slug}
              href={`/project/${project.slug}`}
              className={`card ${isActive ? styles.cardActive : ""}`}
            >
              <div className="image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="image-cover"
                />
              </div>
              <div className="card-content">
                <h2 className="card-title">{project.title}</h2>
                <p className="card-description">{project.description}</p>
                {project.tags.length > 0 && (
                  <div className="tags-container">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag-outlined">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

