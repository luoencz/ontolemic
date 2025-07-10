import Page from '../components/Page';

function About() {
  return (
    <Page title="About">
      <div className="prose prose-sm">
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <p className="mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <h2 className="text-lg font-normal mt-8 mb-4">What I Do</h2>
        <p className="mb-4">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
          architecto beatae vitae dicta sunt explicabo.
        </p>

        <h2 className="text-lg font-normal mt-8 mb-4">Currently</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Working on various projects</li>
          <li>Exploring new technologies</li>
          <li>Writing occasionally</li>
          <li>Building things that interest me</li>
        </ul>

        <p className="mb-4">
          If you'd like to know more, feel free to reach out.
        </p>
      </div>
    </Page>
  );
}

export default About; 