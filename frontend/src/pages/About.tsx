import Page from '../components/pages/Page';
import Gallery from '../components/common/Gallery';

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
      
      {/* I have been born in 2005, in a small town of Academgorodook, in in 20 something kilometers from Nosovibirsk. When I was only 3, my family moved to Saint Petersburg, where I lived until the february of 2022. There, I studied in a private school and planned to go to university of ITMO. During my high school years, I dabbled in dance, theatre, indie game development, and picked up my life-long passion for TTRPGs and snowboarding. In the meanwhile, I attended Yandex ML program. I also have achieved a 0.03 percentile of the world on EUW server of LoL as a toplaner, and played in a number of tournaments. When I moved to Tbilisi, I applied to university of ISU, where I will have finished my CS bachelor's degree in 2026. In the spring of 2024, I have been hired into Palisade Research. In the summer of 2024, I have attended AISF program. In the fall of 2024, I have attended ARENA and have been accepted to ESPR */}
    </Page>
  );
}

export default About; 