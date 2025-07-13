import Page from '../components/pages/Page';
import Gallery from '../components/common/Gallery';
import { PageEmbed } from '../components/pages/PageEmbed';

function About() {
  const aboutPageLayout = {
    columns: 2,
    gap: 16,
    photoLayout: [
      { colSpan: 2, rowSpan: 1 },  // photo1 - full width
      { colSpan: 1, rowSpan: 1 },  // photo2 - left half
      { colSpan: 1, rowSpan: 1 },  // photo3 - right half
    ]
  };

  return (
    <Page title="About">
      <div className="prose prose-sm max-w-none">
        <p className="mb-4">
          Hi! My name is Theo. I'm an AI safety researcher and engineer, located in Tbilisi, Georgia / London, UK. Inner Space is my blog and personal website. I'm a CS major, alumni of such programs as <a href="https://www.arena.education/" target="_blank" rel="noopener noreferrer">ARENA</a>, <a href="https://espr.camp/" target="_blank" rel="noopener noreferrer">ESPR</a>, MIT OCW, <a href="https://bluedot.org/courses/alignment" target="_blank" rel="noopener noreferrer">AISF</a>, and more. I take great interest in anthropology, statistics, mathematics more generally, and philosophy — I think a lot about the nature of reality, and how we can understand it from rationalist perspective. Welcome!
        </p>
        
        <p className="mb-4">
          My current work at <a href="https://palisaderesearch.org/" target="_blank" rel="noopener noreferrer">Palisade Research</a> is focused on building capabilitity demonstrations for agentic AI systems. We advise policy makers and other stakeholders on AI safety and alignment. I'm also a part of the APART fellowship, where we most recently have shipped a paper on AI sandbagging problem. I'm open to new opportunities, feel free to contact me at <a href="mailto:hello.work@xn--the-2na.space">hello.work@xn--the-2na.space</a>.
        </p>
      </div>
      
      <Gallery layout={aboutPageLayout} />
      
      <div className="mt-8">
        <h2 className="text-lg font-normal mb-4">Explore More</h2>
        <div className="space-y-3">
          <PageEmbed to="/projects" size="medium" />
          <PageEmbed to="/blog" size="medium" />
          <PageEmbed to="/research" size="medium" />
        </div>
      </div>
    </Page>
  );
}

export default About; 