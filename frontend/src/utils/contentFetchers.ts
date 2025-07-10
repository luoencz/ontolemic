// Content fetchers for different types of data
// Each fetcher returns a promise that resolves to the data
import * as yaml from 'js-yaml';

export interface Quote {
  id: number;
  text: string;
  author: string;
  context?: string;
  category?: string;
  tags?: string[];
}

// Fetcher for quotes data
export const fetchQuotesData = async (): Promise<Quote[]> => {
  try {
    // Check if we have a YAML file available
    const response = await fetch('/data/quotes.yaml');
    if (response.ok) {
      const yamlText = await response.text();
      const data = yaml.load(yamlText) as { quotes: Array<{ text: string; author: string }> };
      
      // Transform to our Quote interface
      return data.quotes.map((q, index) => ({
        id: index + 1,
        text: q.text,
        author: q.author,
        category: 'general',
        tags: [],
      }));
    }
  } catch (error) {
    console.warn('Failed to load quotes.yaml, using fallback data:', error);
  }
  
  // Fallback quotes if YAML loading fails
  return [
    {
      id: 1,
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "motivation",
      tags: ["work", "passion", "success"]
    },
    {
      id: 2,
      text: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
      category: "wisdom",
      tags: ["challenges", "growth", "perspective"]
    },
    {
      id: 3,
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "inspiration",
      tags: ["dreams", "future", "belief"]
    },
    {
      id: 4,
      text: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
      category: "perseverance",
      tags: ["persistence", "progress", "determination"]
    },
    {
      id: 5,
      text: "Everything you've ever wanted is on the other side of fear.",
      author: "George Addair",
      category: "courage",
      tags: ["fear", "growth", "courage"]
    },
  ];
};

// Fetcher for blog posts
export const fetchBlogPosts = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 1,
      title: "Understanding React Server Components",
      excerpt: "A deep dive into the new React Server Components architecture...",
      date: "2024-01-15",
      readTime: "5 min",
    },
    {
      id: 2,
      title: "The Future of Web Development",
      excerpt: "Exploring emerging trends and technologies shaping the web...",
      date: "2024-01-10",
      readTime: "8 min",
    },
  ];
};

// Fetcher for project data
export const fetchProjectsData = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: 1,
      name: "AI-Powered Code Assistant",
      description: "An intelligent coding companion that helps developers write better code",
      tech: ["TypeScript", "React", "Python", "TensorFlow"],
      status: "active",
    },
    {
      id: 2,
      name: "Distributed Task Scheduler",
      description: "A highly scalable task scheduling system built with microservices",
      tech: ["Go", "Kubernetes", "Redis", "PostgreSQL"],
      status: "completed",
    },
  ];
};

// Fetcher for research papers
export const fetchResearchData = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  return [
    {
      id: 1,
      title: "Attention Is All You Need",
      authors: ["Vaswani et al."],
      year: 2017,
      field: "Machine Learning",
      citations: 50000,
    },
    {
      id: 2,
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      authors: ["Devlin et al."],
      year: 2018,
      field: "NLP",
      citations: 40000,
    },
  ];
};

// Fetcher for images/gallery
export const fetchGalleryData = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: 1,
      url: "/images/project1.jpg",
      thumbnail: "/images/project1-thumb.jpg",
      caption: "Project showcase",
      category: "projects",
    },
    {
      id: 2,
      url: "/images/research1.jpg",
      thumbnail: "/images/research1-thumb.jpg",
      caption: "Research visualization",
      category: "research",
    },
  ];
};

// Content keys for caching
export const CONTENT_KEYS = {
  QUOTES: 'quotes',
  BLOG_POSTS: 'blog_posts',
  PROJECTS: 'projects',
  RESEARCH: 'research',
  GALLERY: 'gallery',
} as const;

// Map of content keys to their fetchers
export const contentFetchers = {
  [CONTENT_KEYS.QUOTES]: fetchQuotesData,
  [CONTENT_KEYS.BLOG_POSTS]: fetchBlogPosts,
  [CONTENT_KEYS.PROJECTS]: fetchProjectsData,
  [CONTENT_KEYS.RESEARCH]: fetchResearchData,
  [CONTENT_KEYS.GALLERY]: fetchGalleryData,
}; 