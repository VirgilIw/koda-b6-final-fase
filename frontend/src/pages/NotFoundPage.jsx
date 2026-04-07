export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-gray-50">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        {/* Icon */}
        <div className="relative mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            🔗
          </div>
          <div className="absolute -top-2 -right-2 rounded-md bg-indigo-600 px-2 py-1 text-xs text-white shadow">
            !
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-indigo-600">404</h1>
        <h2 className="mt-2 text-xl font-semibold">Page Not Found</h2>

        {/* Description */}
        <p className="mt-3 max-w-md text-gray-500">
          The page you're looking for doesn't exist. It may have been moved,
          deleted, or the link might be broken.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700">
            ← Go to Dashboard
          </button>
          <button className="rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300">
            Report an Issue
          </button>
        </div>

        {/* Cards */}
        <div className="mt-12 grid w-full max-w-3xl gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-semibold">📊 Check Analytics</h3>
            <p className="mt-1 text-xs text-gray-500">
              Track your active links and traffic sources in real-time.
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-semibold">🔗 New ShortLink</h3>
            <p className="mt-1 text-xs text-gray-500">
              Create a brand new shortened URL in seconds.
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
            <h3 className="text-sm font-semibold">⚙️ Developer API</h3>
            <p className="mt-1 text-xs text-gray-500">
              Integrate our link infrastructure into your apps.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-gray-400">
        © 2024 SHORTLINK. THE DIGITAL ARCHITECT. &nbsp; | &nbsp;
        <span className="cursor-pointer hover:text-gray-600">
          Privacy Policy
        </span>
        &nbsp; | &nbsp;
        <span className="cursor-pointer hover:text-gray-600">
          Terms of Service
        </span>
        &nbsp; | &nbsp;
        <span className="cursor-pointer hover:text-gray-600">API Docs</span>
        &nbsp; | &nbsp;
        <span className="cursor-pointer hover:text-gray-600">Support</span>
      </footer>
    </div>
  );
}
