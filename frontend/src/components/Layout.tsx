import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/about', label: 'About' },
    { path: '/blog', label: 'Blog and Research' },
    { path: '/projects', label: 'Projects' },
    { path: '/discord', label: 'Discord' },
    { path: '/twitter', label: 'Twitter' },
    { path: '/contact', label: 'Contact' },
    { path: '/archive', label: 'Post Archive' },
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