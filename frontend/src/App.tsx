import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Projects from './pages/Projects';
import WebDev from './pages/projects/WebDev';
import AIML from './pages/projects/AIML';
import OpenSource from './pages/projects/OpenSource';
import Research from './pages/projects/Research';
import Backstage from './pages/backstage/Backstage';
import Quotes from './pages/backstage/Quotes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Regular pages with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/blog" element={<Layout><Home /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/projects/web-dev" element={<Layout><WebDev /></Layout>} />
        <Route path="/projects/ai-ml" element={<Layout><AIML /></Layout>} />
        <Route path="/projects/open-source" element={<Layout><OpenSource /></Layout>} />
        <Route path="/projects/research" element={<Layout><Research /></Layout>} />
        
        {/* Backstage pages */}
        <Route path="/backstage" element={<Layout><Backstage /></Layout>} />
        <Route path="/backstage/quotes" element={<Layout><Quotes /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App; 