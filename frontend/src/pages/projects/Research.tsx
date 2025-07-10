import Page from '../../components/Page';

function Research() {
  return (
    <Page title="Research Papers">
      <div className="prose prose-sm">
        <p className="mb-6">
          Academic publications and technical research in computer science and artificial intelligence.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-normal mb-2">
              Efficient Neural Architecture Search via Parameter Sharing
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Conference on Neural Information Processing Systems (NeurIPS), 2023
            </p>
            <p className="text-gray-600 mb-3">
              Novel approach to neural architecture search that reduces computational cost
              by 90% while maintaining state-of-the-art performance on benchmark datasets.
            </p>
            <div className="flex gap-3 text-sm">
              <a href="#" className="text-blue-600 hover:underline">PDF</a>
              <a href="#" className="text-blue-600 hover:underline">arXiv</a>
              <a href="#" className="text-blue-600 hover:underline">Code</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">
              Attention Mechanisms in Graph Neural Networks: A Survey
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Journal of Machine Learning Research (JMLR), 2023
            </p>
            <p className="text-gray-600 mb-3">
              Comprehensive survey of attention mechanisms applied to graph-structured data,
              with analysis of 50+ recent papers and novel taxonomy.
            </p>
            <div className="flex gap-3 text-sm">
              <a href="#" className="text-blue-600 hover:underline">PDF</a>
              <a href="#" className="text-blue-600 hover:underline">Journal</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-normal mb-2">
              Distributed Training of Large Language Models at Scale
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              International Conference on Machine Learning (ICML), 2022
            </p>
            <p className="text-gray-600 mb-3">
              Framework for efficient distributed training of models with billions of parameters,
              achieving linear scaling up to 1024 GPUs.
            </p>
            <div className="flex gap-3 text-sm">
              <a href="#" className="text-blue-600 hover:underline">PDF</a>
              <a href="#" className="text-blue-600 hover:underline">Slides</a>
              <a href="#" className="text-blue-600 hover:underline">Video</a>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-base font-normal mb-3">Workshop Papers & Preprints</h3>
            <ul className="space-y-2 text-sm">
              <li>
                • <span className="font-medium">Federated Learning with Differential Privacy</span> - 
                ICML Workshop on Privacy in ML, 2022
              </li>
              <li>
                • <span className="font-medium">Interpretable Deep Learning for Time Series</span> - 
                arXiv preprint, 2023
              </li>
              <li>
                • <span className="font-medium">Benchmarking Graph Neural Networks</span> - 
                NeurIPS Dataset Track, 2021
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default Research; 