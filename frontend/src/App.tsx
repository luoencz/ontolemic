import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Home />} />
          <Route path="/projects" element={<Home />} />
          <Route path="/discord" element={<Contact />} />
          <Route path="/twitter" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/archive" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 