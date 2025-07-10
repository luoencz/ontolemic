import { Link } from 'react-router-dom';
import Page from '../components/Page';

function Projects() {
  const categories = [
    {
      path: '/projects/web-dev',
      title: 'Web Development',
      description: 'Full-stack applications, APIs, and web experiences'
    },
    {
      path: '/projects/ai-ml',
      title: 'AI & Machine Learning',
      description: 'Neural networks, data analysis, and intelligent systems'
    },
    {
      path: '/projects/open-source',
      title: 'Open Source',
      description: 'Contributions to the developer community'
    },
    {
      path: '/projects/research',
      title: 'Research Papers',
      description: 'Academic work and technical writing'
    }
  ];

  return (
    <Page title="Projects">
      <div className="prose prose-sm">
        <p className="mb-8">
          A collection of my work across different domains of software engineering and research.
        </p>

        <div className="grid gap-6">
          {categories.map(({ path, title, description }) => (
            <Link
              key={path}
              to={path}
              className="block p-6 border border-gray-200 rounded hover:border-gray-400 transition-colors no-underline"
            >
              <h3 className="text-lg font-normal mb-2">{title}</h3>
              <p className="text-gray-600 text-sm m-0">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Page>
  );
}

export default Projects; 