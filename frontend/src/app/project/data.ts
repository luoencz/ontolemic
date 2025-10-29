// Shared projects data structure
export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    description: "A brief description of the first project goes here.",
    image: "/images/svgs/analemma.svg",
    tags: ["web", "design", "react"],
  },
  {
    slug: "project-two",
    title: "Project Two",
    description: "A brief description of the second project goes here.",
    image: "/images/svgs/analemma.svg",
    tags: ["design", "ui"],
  },
];

// Helper function to get project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

// Helper function to get all unique tags
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  projects.forEach((project) => {
    project.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

