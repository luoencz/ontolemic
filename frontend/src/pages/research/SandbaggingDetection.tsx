import Page from '../../components/pages/Page';

function SandbaggingDetection() {
  return (
    <Page
      thumbnail={{
        title: 'Noise Injection Reveals Hidden Capabilities of Sandbagging Language Models',
        summary: 'A novel model-agnostic method for detecting sandbagging behavior in AI systems using Gaussian noise injection to reveal hidden capabilities.'
      }}
      title="Noise Injection Reveals Hidden Capabilities of Sandbagging Language Models"
    >
      <div className="">
        <div className="max-w-4xl w-full">
          <div className="mb-6">
            <p className="mb-2">
              <strong>Authors:</strong> Cameron Tice, Philipp Alexander Kreer, Nathan Helm-Burger, Prithviraj Singh Shahani, 
              Fedor Ryzhenkov, Jacob Haimes, Felix Hofstätter, Teun van der Weij
            </p>
            <p className="mb-2">
              <strong>Published:</strong> NeurIPS 2024, SATA and SoLaR workshop
            </p>
            <p>
              <strong>arXiv:</strong> <a href="https://arxiv.org/abs/2412.01784" target="_blank" rel="noopener noreferrer">2412.01784</a> | 
              <strong> Code:</strong> <a href="https://github.com/camtice/SandbagDetect" target="_blank" rel="noopener noreferrer" className="ml-1">GitHub</a>
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-3">Abstract</h2>
            <p className="text-gray-700 leading-relaxed">
              Capability evaluations play a critical role in ensuring the safe deployment of frontier AI systems, but this role may be undermined by intentional underperformance or "sandbagging." We present a novel model-agnostic method for detecting sandbagging behavior using noise injection. Our approach is founded on the observation that introducing Gaussian noise into the weights of models either prompted or fine-tuned to sandbag can considerably improve their performance. We test this technique across a range of model sizes and multiple-choice question benchmarks (MMLU, AI2, WMDP). Our results demonstrate that noise injected sandbagging models show performance improvements compared to standard models. Leveraging this effect, we develop a classifier that consistently identifies sandbagging behavior. Our unsupervised technique can be immediately implemented by frontier labs or regulatory bodies with access to weights to improve the trustworthiness of capability evaluations.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-2">
              This research project has originated from a <a href="https://apartresearch.com/project/sandbag-detection-through-model-degradation" target="_blank" rel="noopener noreferrer">pilot experiment</a> that won the Apart x Apollo AI Deception Detection Hackathon. The team was then invited to join the Apart Research Fellowship, where we continued to actively develop the project that ultimately led to this paper and a successful submission to NeurIPS 2024.
            </p>
          </div>

          
        </div>
      </div>
    </Page>
  );
}

export default SandbaggingDetection;