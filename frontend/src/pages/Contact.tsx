import Page from '../components/Page';

function Contact() {
  return (
    <Page title="Contact">
      <div className="prose prose-sm">
        <p className="mb-6">
          Feel free to reach out if you'd like to collaborate, discuss ideas, or just say hello.
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-normal mb-2">Email</h3>
            <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">
              hello@example.com
            </a>
          </div>

          <div>
            <h3 className="text-base font-normal mb-2">GitHub</h3>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              github.com/username
            </a>
          </div>

          <div>
            <h3 className="text-base font-normal mb-2">LinkedIn</h3>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              linkedin.com/in/username
            </a>
          </div>

          <div>
            <h3 className="text-base font-normal mb-2">Twitter</h3>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              @username
            </a>
          </div>
        </div>

        <p className="mt-8 text-gray-600">
          I usually respond within 24-48 hours.
        </p>
      </div>
    </Page>
  );
}

export default Contact; 