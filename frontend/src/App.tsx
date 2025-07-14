import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { Layout } from './components/Layout';

// Lazy load all pages for code splitting
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const Research = lazy(() => import('./pages/Research'));
const Backstage = lazy(() => import('./pages/backstage/Backstage'));
const Quotes = lazy(() => import('./pages/backstage/Quotes'));
const Stats = lazy(() => import('./pages/backstage/Stats'));
const Cue = lazy(() => import('./pages/projects/Cue'));

function App() {
  
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Redirect root to about */}
          <Route path="/" element={<Navigate to="/about" replace />} />
          
          {/* Pages */}
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="projects" element={<Projects />} />
          <Route path="research" element={<Research />} />
          
          {/* Project pages */}
          <Route path="projects/cue" element={<Cue />} />
          
          {/* Backstage pages */}
          <Route path="backstage" element={<Backstage />} />
          <Route path="backstage/quotes" element={<Quotes />} />
          <Route path="backstage/stats" element={<Stats />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 