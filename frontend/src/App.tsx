import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { usePrefetch } from './hooks/usePrefetch';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import Research from './pages/Research';
import Backstage from './pages/backstage/Backstage';
import Quotes from './pages/backstage/Quotes';

function App() {
  // Start prefetching content in the background
  usePrefetch();
  
  return (
    <Router>
      <Routes>
        {/* Regular pages with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/research" element={<Layout><Research /></Layout>} />
        
        {/* Backstage pages */}
        <Route path="/backstage" element={<Layout><Backstage /></Layout>} />
        <Route path="/backstage/quotes" element={<Layout><Quotes /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App; 