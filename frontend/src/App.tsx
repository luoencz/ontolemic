import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { useRoutePrefetch } from './hooks/useRoutePrefetch';

// Lazy load all pages for code splitting
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const Research = lazy(() => import('./pages/Research'));
const NavigationPage = lazy(() => import('./pages/NavigationPage'));
const Backstage = lazy(() => import('./pages/backstage/Backstage'));
const Quotes = lazy(() => import('./pages/backstage/Quotes'));
const Cue = lazy(() => import('./pages/projects/Cue'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-gray-500">Loading...</div>
  </div>
);

function App() {
  // Prefetch all routes using idle time
  // Comment out if you prefer hover-only prefetching
  useRoutePrefetch({
    immediate: true,
    delay: 3000, // Start after 3 seconds
    strategy: 'idle', // Use browser idle time
  });
  
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Redirect root to about */}
          <Route path="/" element={<Navigate to="/about" replace />} />
          
          {/* Regular pages with Layout */}
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/research" element={<Layout><Research /></Layout>} />
          <Route path="/navigation" element={<Layout><NavigationPage /></Layout>} />
          
          {/* Project pages */}
          <Route path="/projects/cue" element={<Layout><Cue /></Layout>} />
          
          {/* Backstage pages */}
          <Route path="/backstage" element={<Layout><Backstage /></Layout>} />
          <Route path="/backstage/quotes" element={<Layout><Quotes /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App; 