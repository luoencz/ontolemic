function AIML() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-normal mb-6">AI & Machine Learning Projects</h1>
      
      <div className="prose prose-sm">
        <p className="mb-6">
          Research projects, models, and experiments in artificial intelligence.
        </p>

        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Research Project 1</h3>
            <p className="text-gray-600 mb-3">
              Description of an AI/ML research project or experiment you've conducted.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1">Python</span>
              <span className="bg-gray-100 px-2 py-1">TensorFlow</span>
              <span className="bg-gray-100 px-2 py-1">Jupyter</span>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-normal mb-2">Model Implementation</h3>
            <p className="text-gray-600 mb-3">
              Implementation and evaluation of a specific machine learning model or algorithm.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1">PyTorch</span>
              <span className="bg-gray-100 px-2 py-1">scikit-learn</span>
            </div>
          </div>

          <div className="pb-6">
            <h3 className="text-lg font-normal mb-2">Data Analysis Project</h3>
            <p className="text-gray-600 mb-3">
              Large-scale data analysis and visualization project with machine learning insights.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1">Pandas</span>
              <span className="bg-gray-100 px-2 py-1">NumPy</span>
              <span className="bg-gray-100 px-2 py-1">Matplotlib</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIML; 