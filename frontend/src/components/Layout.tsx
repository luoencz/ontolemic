import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [projectsOpen, setProjectsOpen] = useState(false);

  const navItems = [
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog and Research' },
    { path: '/contact', label: 'Contact' },
  ];

  const projectItems = [
    { path: '/projects', label: 'All Projects' },
    { path: '/projects/web-dev', label: 'Web Development' },
    { path: '/projects/ai-ml', label: 'AI & Machine Learning' },
    { path: '/projects/open-source', label: 'Open Source' },
    { path: '/projects/research', label: 'Research Papers' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 p-8">
        <Link to="/" className="text-2xl font-normal hover:underline">
          Inner Cosmos
        </Link>
        
        <p className="text-sm text-gray-600 mt-2 mb-8">
          this, too, is it
        </p>

        <nav className="space-y-2">
          {navItems.map(({ path, label }) => (
            <div key={path}>
              <Link
                to={path}
                className={`block py-1 text-sm hover:underline ${
                  location.pathname === path ? 'font-bold' : ''
                }`}
              >
                {label}
              </Link>
            </div>
          ))}
          
          {/* Projects dropdown */}
          <div className="relative">
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              onMouseEnter={() => setProjectsOpen(true)}
              className={`block py-1 text-sm hover:underline text-left w-full ${
                location.pathname.startsWith('/projects') ? 'font-bold' : ''
              }`}
            >
              Projects
            </button>
            
            {projectsOpen && (
              <div 
                className="ml-4 mt-1 space-y-1"
                onMouseLeave={() => setProjectsOpen(false)}
              >
                {projectItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`block py-1 text-sm hover:underline ${
                      location.pathname === path ? 'font-bold' : 'text-gray-600'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default Layout; 