import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { Layout } from './components/Layout';

// Lazy load all pages for code splitting
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Community = lazy(() => import('./pages/Community'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const Research = lazy(() => import('./pages/Research'));
const Resources = lazy(() => import('./pages/Resources'));
const Backstage = lazy(() => import('./pages/backstage/Backstage'));
const Quotes = lazy(() => import('./pages/backstage/Quotes'));
const Stats = lazy(() => import('./pages/backstage/Stats'));
const Schema = lazy(() => import('./pages/backstage/Schema'));
const Cue = lazy(() => import('./pages/projects/Cue'));
const Blank = lazy(() => import('./pages/projects/Blank'));
const Scribe = lazy(() => import('./pages/projects/Scribe'));

// Research pages
const SandbaggingDetection = lazy(() => import('./pages/research/SandbaggingDetection'));

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
          <Route path="community" element={<Community />} />
          <Route path="contact" element={<Contact />} />
          <Route path="projects" element={<Projects />} />
          <Route path="research" element={<Research />} />
          <Route path="resources" element={<Resources />} />
          
          {/* Project pages */}
          <Route path="projects/cue" element={<Cue />} />
          <Route path="projects/blank" element={<Blank />} />
          <Route path="projects/scribe" element={<Scribe />} />
          
          {/* Research pages */}
          <Route path="research/sandbagging-detection" element={<SandbaggingDetection />} />
        
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