export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white border-b">
        <h1 className="font-bold text-lg">ShortLink</h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-black">Login</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Shorten URLs.{" "}
          <span className="text-indigo-600">Share Easily.</span>
        </h1>

        <p className="mt-4 text-gray-600 max-w-xl mx-auto">
          Create short, memorable links for your team or communications.
        </p>

        {/* Input */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-3">
          <input
            type="text"
            placeholder="Paste your long URL..."
            className="px-4 py-3 w-full md:w-96 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
            Shorten
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 px-8 md:px-20 py-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg">⚡ Easy Create</h3>
          <p className="text-gray-600 text-sm mt-2">
            Quickly create short links with a clean interface.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg">🔗 Custom Slugs</h3>
          <p className="text-gray-600 text-sm mt-2">
            Customize your URLs for branding or clarity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg">👥 Team Ready</h3>
          <p className="text-gray-600 text-sm mt-2">
            Built for collaboration and analytics.
          </p>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="flex flex-col md:flex-row items-center gap-10 px-8 md:px-20 py-16">
        
        <img
          src="https://via.placeholder.com/500"
          alt="analytics"
          className="rounded-xl shadow-md w-full md:w-1/2"
        />

        <div className="max-w-md">
          <h2 className="text-2xl font-bold">
            Observe your link architecture in real-time.
          </h2>

          <ul className="mt-4 space-y-2 text-gray-600">
            <li>📊 Geographic Distribution Maps</li>
            <li>🖥️ Device & Browser Tracking</li>
            <li>🔗 UTM Parameter Tracking</li>
          </ul>
        </div>
      </section>

    </div>
  );
}