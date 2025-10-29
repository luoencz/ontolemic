import { projects, getAllTags } from "./data";
import ProjectsClient from "./client";

export default function Projects() {
  const allTags = getAllTags();

  return (
    <main className="page-main">
      <div className="page-content-wide">
        <div className="page-header">
          <h2>Projects</h2>
        </div>
        <ProjectsClient projects={projects} allTags={allTags} />
      </div>
    </main>
  );
}

