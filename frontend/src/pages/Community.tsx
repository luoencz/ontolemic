import Page from '../components/pages/Page';

function Community() {
  return (
    <Page title="Community">
      <div className="prose prose-sm max-w-none">
        <p className="mb-6">
          Join Inner Space discord server to connect with the aligned community of nerdy rationalists and the like. I tend to be active on the server and often cowork with other members in the voice channels. Feel free to say hi!
        </p>
        <a 
          href="https://discord.gg/Xe2c2ZF5uJ" 
          target="_blank" 
          rel="noopener noreferrer"
        >
        Discord Server
        </a>
      </div>
    </Page>
  );
}

export default Community;