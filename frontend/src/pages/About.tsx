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

      <div className="prose prose-sm max-w-none">
        <p>
          <p className="mb-4">
            My other interest include but are not limited to:
          </p>
          <ul>
            <li className="mb-4">
              <strong>TTRPGs</strong> — I'm designing and running TTRPG games, and have founded and run the largest TTRPG community in Georgia.
            </li>
            <li className="mb-4">
              <strong>Dance</strong> — I have been semi-professionaly dancing since I was 11, with main focus on house dance, but covering contemporary, hip-hop, break and more.
            </li>
            <li className="mb-4">
              <strong>Music</strong> — I have unfortunately never found the time or dedication to learn to play an instrument, but I'm a proud owner of a variety of Hi-Fi audio equipment, and have a wide collection of albums. My main genres are progressive metal, experimental hip-hop and synthesizers music. 
            </li>
            <li className="mb-4">
              <strong>Theatre</strong> — I have been a member of a theatre troupe throughout my school years, and had the honor of performing on most famous stages in modern Russian theatre. I'm a big fan of musicals, and try to visit west end whenever I can.
            </li>
            <li className="mb-4">
              <strong>Snowboarding</strong> — I have been very dedicated to the sport since my young years, and achieved good level of proficiency in carving, freestyling and free riding. 
            </li>
          </ul>
        </p>
      </div>
    </Page>
  );
}

export default About; 