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
import { Backstage } from './pages/Backstage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/backstage" element={<Backstage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/web-dev" element={<WebDev />} />
          <Route path="/projects/ai-ml" element={<AIML />} />
          <Route path="/projects/open-source" element={<OpenSource />} />
          <Route path="/projects/research" element={<Research />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 