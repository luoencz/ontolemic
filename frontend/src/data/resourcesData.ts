export interface ResourceNode {
  id: string;
  title: string;
  type: 'book' | 'paper' | 'video' | 'essay' | 'category' | 'newsletter' | 'blog' | 'channel';
  author?: string;
  description?: string;
  url?: string;
  children?: string[];
}

export interface RenderedResourceNode extends ResourceNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ResourceLink {
  source: string;
  target: string;
  type: 'parent' | 'sibling';
  label?: string;
}

export interface ResourceGraph {
  nodes: ResourceNode[];
  links: ResourceLink[];
}

export const resourcesData: ResourceGraph = {
  nodes: [
    { id: 'root', title: 'Resources', type: 'category' },
    { id: 'newsletter', title: 'Newsletters', type: 'category' },
    { id: 'fiction', title: 'Fiction', type: 'category' },
    { id: 'blogs', title: 'Blogs', type: 'category' },
    { id: 'channels', title: 'Channels', type: 'category' },
    { id: 'aeon', title: 'Aeon', type: 'newsletter', url: 'https://aeon.co/', description: 'Aeon is a not-for-profit digital magazine publishing essays and videos on philosophy, science, psychology, society, and culture. Its mission is to explore and communicate knowledge that helps us make sense of ourselves and the world, featuring longform explorations and curated documentaries by leading thinkers.' },
    { id: 'astral-codex-ten', title: 'Astral Codex Ten', author: 'Scott Alexander', type: 'blog', url: 'https://www.astralcodexten.com/', description: 'Scott Alexander\'s blog featuring in-depth essays on psychiatry, rationality, AI, social science, and culture. Known for thoughtful analysis, book reviews, and exploring complex ideas with clarity and humor.' },
    { id: 'twoswap', title: 'Twoswap', type: 'channel', url: 'https://www.youtube.com/@twoswap', description: 'Channel focused on mathematics, physics, and computer science concepts explained through engaging visual demonstrations and clear explanations.' },
    { id: 'anathem', title: 'Anathem', author: 'Neal Stephenson', type: 'book', description: 'A philosophical science fiction epic exploring mathematics, quantum mechanics, and parallel universes through the lens of a monastic order devoted to science and philosophy.' },
    { id: 'blindsight', title: 'Blindsight', author: 'Peter Watts', type: 'book', description: 'Hard science fiction exploring consciousness, intelligence, and first contact.', url: 'https://www.rifters.com/real/Blindsight.htm' },
    { id: 'left-hand-of-darkness', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', type: 'book', description: 'A groundbreaking work of science fiction that explores gender, sexuality, and human relationships on a planet where inhabitants can change their sex.' },
    { id: 'revelation-space', title: 'Revelation Space', author: 'Alastair Reynolds', type: 'book', description: 'A space opera combining hard science fiction with cosmic horror, exploring vast timescales, ancient alien civilizations, and the Fermi paradox.' },
    { id: 'dune', title: 'Dune', author: 'Frank Herbert', type: 'book', description: 'A science fiction masterpiece exploring politics, religion, ecology, and human potential on the desert planet Arrakis.' }
  ],
  links: [
    { source: 'root', target: 'newsletter', type: 'parent' },
    { source: 'root', target: 'fiction', type: 'parent' },
    { source: 'root', target: 'blogs', type: 'parent' },
    { source: 'root', target: 'channels', type: 'parent' },
    { source: 'newsletter', target: 'aeon', type: 'parent' },
    { source: 'blogs', target: 'astral-codex-ten', type: 'parent' },
    { source: 'channels', target: 'twoswap', type: 'parent' },
    { source: 'fiction', target: 'anathem', type: 'parent' },
    { source: 'fiction', target: 'blindsight', type: 'parent' },
    { source: 'fiction', target: 'left-hand-of-darkness', type: 'parent' },
    { source: 'fiction', target: 'revelation-space', type: 'parent' },
    { source: 'fiction', target: 'dune', type: 'parent' }
  ]
};