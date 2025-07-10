import Page from '../../components/Page';

function AIML() {
  return (
    <Page title="AI & Machine Learning Projects">
      <div className="prose prose-sm">
        <p className="mb-6">
          Research and applications in artificial intelligence, machine learning, and data science.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-normal mb-2">Neural Architecture Search</h3>
            <p className="text-gray-600 mb-2">
              Automated system for discovering optimal neural network architectures
              using evolutionary algorithms and reinforcement learning.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: PyTorch, Ray, Python</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">Computer Vision for Medical Imaging</h3>
            <p className="text-gray-600 mb-2">
              Deep learning models for automated detection and classification of
              anomalies in medical imaging data with 95%+ accuracy.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: TensorFlow, OpenCV, DICOM</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">NLP Sentiment Analysis Engine</h3>
            <p className="text-gray-600 mb-2">
              Multi-language sentiment analysis system using transformer models,
              capable of processing social media data at scale.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: Transformers, BERT, Apache Spark</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">Reinforcement Learning Game Agent</h3>
            <p className="text-gray-600 mb-2">
              RL agent trained to play complex strategy games using deep Q-learning
              and policy gradient methods.
            </p>
            <div className="text-sm text-gray-500">
              <span>Tech: Stable Baselines3, OpenAI Gym</span>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default AIML; 