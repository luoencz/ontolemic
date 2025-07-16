import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { Layout } from './components/Layout';

// Lazy load all pages for code splitting
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const Research = lazy(() => import('./pages/Research'));
const Resources = lazy(() => import('./pages/resources/Resources'));
const Reading = lazy(() => import('./pages/resources/Reading'));
const Backstage = lazy(() => import('./pages/backstage/Backstage'));
const Quotes = lazy(() => import('./pages/backstage/Quotes'));
const Stats = lazy(() => import('./pages/backstage/Stats'));
const Schema = lazy(() => import('./pages/backstage/Schema'));
const Cue = lazy(() => import('./pages/projects/Cue'));
const Blank = lazy(() => import('./pages/projects/Blank'));

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
          <Route path="resources" element={<Resources />} />
          
          {/* Project pages */}
          <Route path="projects/cue" element={<Cue />} />
          <Route path="projects/blank" element={<Blank />} />
          
          {/* Resources pages */}
          <Route path="resources/reading" element={<Reading />} />
          
          {/* Backstage pages */}
          <Route path="backstage" element={<Backstage />} />
          <Route path="backstage/quotes" element={<Quotes />} />
          <Route path="backstage/stats" element={<Stats />} />
          <Route path="backstage/schema" element={<Schema />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 