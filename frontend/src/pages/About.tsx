import Page from '../components/Page';
import PhotoGrid from '../components/PhotoGrid';

function About() {
  return (
    <Page title="About">
      <div className="prose prose-sm">
        <p className="mb-4">
          Hi! My name is Theo. I'm an AI safety researcher and engineer, located in Tbilisi, Georgia / London, UK. Inner Space is my blog and personal website. I'm a CS major, alumni of such programs as <a href="https://www.arena.education/" target="_blank" rel="noopener noreferrer">ARENA</a>, <a href="https://espr.camp/" target="_blank" rel="noopener noreferrer">ESPR</a>, MIT OCW, <a href="https://bluedot.org/courses/alignment" target="_blank" rel="noopener noreferrer">AISF</a>, and more. I take great interest in anthropology, statistics, mathematics more generally, and philosophy — I think a lot about the nature of reality, and how we can understand it from rationalist perspective. Welcome!
        </p>
        
        <p className="mb-4">
          My current work at <a href="https://palisaderesearch.org/" target="_blank" rel="noopener noreferrer">Palisade Research</a> is focused on building capabilitity demonstrations for agentic AI systems. We advise policy makers and other stakeholders on AI safety and alignment. I'm also a part of the APART fellowship, where we most recently have shipped a paper on AI sandbagging problem. I'm open to new opportunities, feel free to contact me at <a href="mailto:hello.work@xn--the-2na.space">hello.work@xn--the-2na.space</a>.
        </p>
      </div>
      
      <PhotoGrid />
    </Page>
  );
}

export default About; 