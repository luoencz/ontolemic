function Contact() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-normal mb-6">Contact</h1>
      
      <div className="prose prose-sm">
        <p className="mb-4">
          Feel free to reach out if you'd like to discuss projects, collaborations, 
          or just want to chat.
        </p>

        <div className="mb-8">
          <p className="mb-2">
            <strong>Email:</strong> <a href="mailto:hello@example.com" className="underline">hello@example.com</a>
          </p>
          <p className="mb-2">
            <strong>GitHub:</strong> <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline">@username</a>
          </p>
          <p className="mb-2">
            <strong>Twitter:</strong> <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="underline">@username</a>
          </p>
          <p className="mb-2">
            <strong>LinkedIn:</strong> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="underline">Professional Profile</a>
          </p>
        </div>

        <p className="mb-4">
          I'm always interested in hearing about new projects and opportunities. 
          Whether you're looking for a collaborator, have a question about something 
          I've worked on, or just want to say hello, don't hesitate to reach out.
        </p>

        <p className="mb-4">
          Response time varies depending on current workload, but I try to get back 
          to everyone within a few days.
        </p>
      </div>
    </div>
  );
}

export default Contact; 