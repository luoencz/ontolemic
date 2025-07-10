import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { usePrefetch } from './hooks/usePrefetch';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Research from './pages/Research';
import NavigationPage from './pages/NavigationPage';
import Backstage from './pages/backstage/Backstage';
import Quotes from './pages/backstage/Quotes';

function App() {
  // Start prefetching content in the background
  usePrefetch();
  
  return (
    <Router>
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
        
        {/* Backstage pages */}
        <Route path="/backstage" element={<Layout><Backstage /></Layout>} />
        <Route path="/backstage/quotes" element={<Layout><Quotes /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App; 