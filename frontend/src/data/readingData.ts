import { ReadingGraph } from '../types/reading';

export const readingData: ReadingGraph = {
  nodes: [
    {
      id: 'root',
      title: 'Reading',
      type: 'category',
      children: ['ai-safety', 'philosophy', 'computer-science', 'fiction']
    },
    // Root categories
    {
      id: 'ai-safety',
      title: 'AI Safety & Alignment',
      type: 'category',
      children: ['superintelligence', 'alignment-problem', 'concrete-problems']
    },
    {
      id: 'philosophy',
      title: 'Philosophy',
      type: 'category',
      children: ['geb', 'conscious-mind', 'being-time']
    },
    {
      id: 'computer-science',
      title: 'Computer Science',
      type: 'category',
      children: ['sicp', 'algorithm-design', 'distributed-systems']
    },
    {
      id: 'fiction',
      title: 'Fiction',
      type: 'category',
      children: ['permutation-city', 'blindsight', 'three-body']
    },
    
    // AI Safety books/papers
    {
      id: 'superintelligence',
      title: 'Superintelligence: Paths, Dangers, Strategies',
      author: 'Nick Bostrom',
      type: 'book',
      description: 'A comprehensive analysis of the risks and challenges posed by artificial superintelligence.',
      url: 'https://www.goodreads.com/book/show/20527133-superintelligence'
    },
    {
      id: 'alignment-problem',
      title: 'The Alignment Problem',
      author: 'Brian Christian',
      type: 'book',
      description: 'How can we ensure that artificial intelligence systems do what we want them to do?',
      url: 'https://brianchristian.org/the-alignment-problem/'
    },
    {
      id: 'concrete-problems',
      title: 'Concrete Problems in AI Safety',
      author: 'Amodei et al.',
      type: 'paper',
      description: 'A research agenda for ensuring safe behavior in AI systems.',
      url: 'https://arxiv.org/abs/1606.06565'
    },
    
    // Philosophy books
    {
      id: 'geb',
      title: 'Gödel, Escher, Bach',
      author: 'Douglas Hofstadter',
      type: 'book',
      description: 'An exploration of consciousness, meaning, and intelligence through mathematics, art, and music.',
      url: 'https://en.wikipedia.org/wiki/G%C3%B6del,_Escher,_Bach'
    },
    {
      id: 'conscious-mind',
      title: 'The Conscious Mind',
      author: 'David Chalmers',
      type: 'book',
      description: 'A philosophical investigation into the nature of consciousness and the mind-body problem.',
      url: 'https://www.goodreads.com/book/show/144960.The_Conscious_Mind'
    },
    {
      id: 'being-time',
      title: 'Being and Time',
      author: 'Martin Heidegger',
      type: 'book',
      description: 'A foundational work in existential philosophy exploring the nature of Being.',
      url: 'https://en.wikipedia.org/wiki/Being_and_Time'
    },
    
    // Computer Science books
    {
      id: 'sicp',
      title: 'Structure and Interpretation of Computer Programs',
      author: 'Abelson & Sussman',
      type: 'book',
      description: 'A foundational text on programming and computational thinking.',
      url: 'https://mitpress.mit.edu/sites/default/files/sicp/index.html'
    },
    {
      id: 'algorithm-design',
      title: 'Algorithm Design',
      author: 'Kleinberg & Tardos',
      type: 'book',
      description: 'A comprehensive guide to algorithm design techniques and analysis.',
      url: 'https://www.cs.princeton.edu/~wayne/kleinberg-tardos/'
    },
    {
      id: 'distributed-systems',
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      type: 'book',
      description: 'The big ideas behind reliable, scalable, and maintainable systems.',
      url: 'https://dataintensive.net/'
    },
    
    // Fiction books
    {
      id: 'permutation-city',
      title: 'Permutation City',
      author: 'Greg Egan',
      type: 'book',
      description: 'A mind-bending exploration of consciousness, simulation, and digital immortality.',
      url: 'https://www.gregegan.net/PERMUTATION/Permutation.html'
    },
    {
      id: 'blindsight',
      title: 'Blindsight',
      author: 'Peter Watts',
      type: 'book',
      description: 'Hard science fiction exploring consciousness, intelligence, and first contact.',
      url: 'https://www.rifters.com/real/Blindsight.htm'
    },
    {
      id: 'three-body',
      title: 'The Three-Body Problem',
      author: 'Liu Cixin',
      type: 'book',
      description: 'A science fiction masterpiece about humanity\'s first contact with an alien civilization.',
      url: 'https://en.wikipedia.org/wiki/The_Three-Body_Problem_(novel)'
    }
  ],
  links: [
    { source: 'root', target: 'ai-safety' },
    { source: 'root', target: 'philosophy' },
    { source: 'root', target: 'computer-science' },
    { source: 'root', target: 'fiction' },

    // Category to items
    { source: 'ai-safety', target: 'superintelligence' },
    { source: 'ai-safety', target: 'alignment-problem' },
    { source: 'ai-safety', target: 'concrete-problems' },
    
    { source: 'philosophy', target: 'geb' },
    { source: 'philosophy', target: 'conscious-mind' },
    { source: 'philosophy', target: 'being-time' },
    
    { source: 'computer-science', target: 'sicp' },
    { source: 'computer-science', target: 'algorithm-design' },
    { source: 'computer-science', target: 'distributed-systems' },
    
    { source: 'fiction', target: 'permutation-city' },
    { source: 'fiction', target: 'blindsight' },
    { source: 'fiction', target: 'three-body' }
  ]
}; 