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
              className={`flex items-center justify-between w-full py-1 text-sm hover:underline text-left select-none focus:outline-none focus:ring-0 focus:border-none active:outline-none active:ring-0 active:border-none ${
                location.pathname.startsWith('/projects') ? 'font-bold' : ''
              }`}
              style={{ 
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span>Projects</span>
              <svg 
                className={`w-3 h-3 ml-2 transition-transform duration-200 ${
                  projectsOpen ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {projectsOpen && (
              <div className="ml-4 mt-1 space-y-1">
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