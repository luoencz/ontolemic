import type { ResourceGraph, ResourceNode, ResourceLink } from '../types/resources';

// --- Nodes by category ---
const categoryNodes: ResourceNode[] = [
  { id: 'reading', title: 'Reading', type: 'category' },
  { id: 'newsletter', title: 'Newsletters', type: 'category' },
  { id: 'fiction', title: 'Fiction', type: 'category' },
  { id: 'non-fiction', title: 'Non Fiction', type: 'category' },
  { id: 'sci-fi', title: 'Sci-Fi', type: 'category' },
  { id: 'channels', title: 'Channels', type: 'category' },
  { id: 'games', title: 'Games', type: 'category' },
  { id: 'websites', title: 'Websites', type: 'category' }
];

const websiteNodes: ResourceNode[] = [
  { id: 'bleuje', title: 'bleuje', type: 'website', url: 'https://bleuje.com/', description: 'Loops, creative coding. Animations and generative art by Etienne Jacob.' },
  { id: 'everynoise', title: 'Every Noise at Once', type: 'website', url: 'https://everynoise.com', description: 'Algorithmically-generated scatter-plot of the musical genre-space, based on Spotify data. Explore genres, playlists, and the evolution of music.' },
  { id: 'jpalmer', title: 'jpalmer.dev', type: 'website', url: 'https://jpalmer.dev/', description: 'Generative artist and data visualizer Jeff Palmer. Features blog posts, interactive visualizations, and generative art projects.' },
  { id: 'ncase', title: 'Nicky Case', type: 'website', url: 'https://ncase.me/', description: 'Interactive educational projects, games, and explorable explanations by Nicky Case. Focuses on learning through play, mental health, and complex systems.' },
  { id: 'pages', title: 'Pages', type: 'category', description: 'Curated list of specific web pages.' }
];

const pageNodes: ResourceNode[] = [
  { id: 'kennaway-conlang', title: 'Kennaway: Constructed Languages', type: 'page', url: 'https://kennaway.org.uk/conlang.html', description: 'A comprehensive resource on constructed languages (conlangs) by Richard Kennaway.' },
  { id: 'evolution-of-trust', title: 'The Evolution of Trust', type: 'page', url: 'https://ncase.me/trust/', description: 'An interactive guide to game theory, exploring why and how we trust each other. Created by Nicky Case.' }
];

const sciFiNodes: ResourceNode[] = [
  { id: 'anathem', title: 'Anathem', author: 'Neal Stephenson', type: 'book', description: 'A philosophical science fiction epic exploring mathematics, quantum mechanics, and parallel universes through the lens of a monastic order devoted to science and philosophy.' },
  { id: 'blindsight', title: 'Blindsight', author: 'Peter Watts', type: 'book', description: 'Hard science fiction exploring consciousness, intelligence, and first contact.', url: 'https://www.rifters.com/real/Blindsight.htm' },
  { id: 'left-hand-of-darkness', title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', type: 'book', description: 'A groundbreaking work of science fiction that explores gender, sexuality, and human relationships on a planet where inhabitants can change their sex.' },
  { id: 'revelation-space', title: 'Revelation Space', author: 'Alastair Reynolds', type: 'book', description: 'A space opera combining hard science fiction with cosmic horror, exploring vast timescales, ancient alien civilizations, and the Fermi paradox.' },
  { id: 'dune', title: 'Dune', author: 'Frank Herbert', type: 'book', description: 'A science fiction masterpiece exploring politics, religion, ecology, and human potential on the desert planet Arrakis.' }
];

const newsletterNodes: ResourceNode[] = [
  { id: 'aeon', title: 'Aeon', type: 'newsletter', url: 'https://aeon.co/', description: 'Aeon is a not-for-profit digital magazine publishing essays and videos on philosophy, science, psychology, society, and culture. Its mission is to explore and communicate knowledge that helps us make sense of ourselves and the world, featuring longform explorations and curated documentaries by leading thinkers.' },
  { id: 'knowingless', title: 'Knowingless', author: 'Aella', type: 'newsletter', url: 'https://aella.substack.com/', description: 'A newsletter exploring sex, psychedelics, and social analysis through data-driven research and personal experimentation. Known for unconventional surveys and thought-provoking insights into human behavior and society.' },
  { id: 'intrinsic-perspective', title: 'The Intrinsic Perspective', author: 'Erik Hoel', type: 'newsletter', url: 'https://www.theintrinsicperspective.com/', description: 'Bridging the two cultures of science and the humanities. Written by neuroscientist and novelist Erik Hoel, covering consciousness, literature, AI, and the intersection of scientific and humanistic thinking.' },
  { id: 'astral-codex-ten', title: 'Astral Codex Ten', author: 'Scott Alexander', type: 'newsletter', url: 'https://www.astralcodexten.com/', description: 'Scott Alexander\'s blog featuring in-depth essays on psychiatry, rationality, AI, social science, and culture. Known for thoughtful analysis, book reviews, and exploring complex ideas with clarity and humor.' }
];

const channelNodes: ResourceNode[] = [
  { id: 'twoswap', title: 'Twoswap', type: 'channel', url: 'https://www.youtube.com/@twoswap', description: 'Channel focused on mathematics, physics, and computer science concepts explained through engaging visual demonstrations and clear explanations.' },
  { id: 'primer', title: 'Primer', type: 'channel', url: 'https://www.youtube.com/@PrimerBlobs', description: 'Educational YouTube channel creating animated videos about evolution, game theory, and complex systems using simple simulations and clear visual explanations.' },
  { id: '3blue1brown', title: '3Blue1Brown', type: 'channel', url: 'https://www.youtube.com/@3blue1brown', description: 'Math education channel by Grant Sanderson, renowned for visually stunning explanations of mathematical concepts ranging from linear algebra to calculus, topology, and neural networks.' }
];

const gameNodes: ResourceNode[] = [
  { id: 'disco-elysium', title: 'Disco Elysium', type: 'game', description: 'A groundbreaking role-playing game blending narrative depth, philosophy, and detective work.' }
];

const nonFictionNodes: ResourceNode[] = [
  { id: 'anthropology', title: 'Anthropology', type: 'category' }
];

const anthropologyNodes: ResourceNode[] = [
  { id: 'debt-graeber', title: 'Debt: The First 5,000 Years', author: 'David Graeber', type: 'book', url: 'https://www.goodreads.com/book/show/6617037-debt', description: 'A sweeping history of debt, money, and credit systems from ancient times to the present, challenging conventional economic narratives. Graeber explores the origins of money, the role of debt in society, and the moral and political implications of financial systems.' }
];

// --- Links by category ---
const readingLinks: ResourceLink[] = [
  { source: 'reading', target: 'fiction', type: 'parent' },
  { source: 'reading', target: 'non-fiction', type: 'parent' }
];

const fictionLinks: ResourceLink[] = [
  { source: 'fiction', target: 'sci-fi', type: 'parent' }
];

const sciFiLinks: ResourceLink[] = [
  { source: 'sci-fi', target: 'anathem', type: 'parent' },
  { source: 'sci-fi', target: 'blindsight', type: 'parent' },
  { source: 'sci-fi', target: 'left-hand-of-darkness', type: 'parent' },
  { source: 'sci-fi', target: 'revelation-space', type: 'parent' },
  { source: 'sci-fi', target: 'dune', type: 'parent' }
];

const nonFictionLinks: ResourceLink[] = [
  { source: 'non-fiction', target: 'anthropology', type: 'parent' },
  { source: 'anthropology', target: 'debt-graeber', type: 'parent' }
];

const newsletterLinks: ResourceLink[] = [
  { source: 'newsletter', target: 'aeon', type: 'parent' },
  { source: 'newsletter', target: 'knowingless', type: 'parent' },
  { source: 'newsletter', target: 'intrinsic-perspective', type: 'parent' },
  { source: 'newsletter', target: 'astral-codex-ten', type: 'parent' }
];

const channelLinks: ResourceLink[] = [
  { source: 'channels', target: 'twoswap', type: 'parent' },
  { source: 'channels', target: 'primer', type: 'parent' },
  { source: 'channels', target: '3blue1brown', type: 'parent' }
];

const gameLinks: ResourceLink[] = [
  { source: 'games', target: 'disco-elysium', type: 'parent' }
];

const websiteLinks: ResourceLink[] = [
  { source: 'websites', target: 'bleuje', type: 'parent' },
  { source: 'websites', target: 'everynoise', type: 'parent' },
  { source: 'websites', target: 'jpalmer', type: 'parent' },
  { source: 'websites', target: 'ncase', type: 'parent' },
  { source: 'ncase', target: 'evolution-of-trust', type: 'parent' },
  { source: 'websites', target: 'pages', type: 'parent' },
  { source: 'pages', target: 'kennaway-conlang', type: 'parent' }
];

export const resourcesData: ResourceGraph = {
  nodes: [
    ...categoryNodes,
    ...sciFiNodes,
    ...nonFictionNodes,
    ...anthropologyNodes,
    ...newsletterNodes,
    ...channelNodes,
    ...gameNodes,
    ...websiteNodes,
    ...pageNodes
  ],
  links: [
    ...readingLinks,
    ...fictionLinks,
    ...sciFiLinks,
    ...nonFictionLinks,
    ...newsletterLinks,
    ...channelLinks,
    ...gameLinks,
    ...websiteLinks
  ]
};