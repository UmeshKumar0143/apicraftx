export default function DashBoard() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] text-gray-800 bg-white">
      {/* Header */}
      <header className="bg-white py-4 px-8 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-teal-500 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF6C37"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            API Craft
          </div>
          
          <div className="flex items-center">
            <a
              href="#"
              className="px-4 py-2 border border-gray-800 rounded mr-4 font-medium hover:bg-gray-50 transition-colors"
            >
              Sign In
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-teal-500 text-white rounded font-medium hover:bg-teal-600 transition-colors"
            >
              Sign Up for Free
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-coral-500 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Test APIs together, faster</h1>
            <p className="text-xl mb-8">
              API Craft is an API platform for Testing APIs.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <a
                href="../main/index.html"
                className="px-6 py-3 bg-white text-teal-500 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                Try API Craft for Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Test APIs—faster better
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-8 shadow hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-medium mb-4">API Repository</h3>
              <p className="text-gray-500">
                Store, iterate, and collaborate around all your APIs in one central
                repository.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-medium mb-4">API Design</h3>
              <p className="text-gray-500">
                Design and mock APIs with our intuitive interface and powerful tooling.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-xl font-medium mb-4">API Testing</h3>
              <p className="text-gray-500">
                Create functional, integration, regression, and performance tests.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-medium mb-4">API Monitoring</h3>
              <p className="text-gray-500">
                Monitor your API endpoints for performance and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-800 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">
            Build and Test Robust APIs with Confidence
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join millions of developers who are building the future with API Craft.
          </p>
          <a
            href="#"
            className="px-8 py-3 bg-teal-500 text-white rounded text-lg font-medium hover:bg-teal-600 transition-colors"
          >
            Sign Up for Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="text-center py-6">
          <p className="text-black">
            &copy; 2025 API Craft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}