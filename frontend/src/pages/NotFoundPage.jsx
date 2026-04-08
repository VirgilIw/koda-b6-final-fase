import { BarChart2, Link2Off, Layers } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <Link2Off className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div
              className="w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "10px solid white",
              }}
            />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-5xl font-bold text-indigo-600 mb-3 tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 text-center max-w-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist. It may have been moved,
          deleted, or the link might be broken.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 mb-14">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            <span className="text-base leading-none">&#8592;</span>
            Go to Dashboard
          </button>
          <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Report an Issue
          </button>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl w-full">
          <Card
            icon={<BarChart2 className="w-6 h-6 text-indigo-500" strokeWidth={1.8} />}
            title="Check Analytics"
            desc="Track your active links and traffic sources in real-time."
          />
          <Card
            icon={<Link2Off className="w-6 h-6 text-indigo-500" strokeWidth={1.8} />}
            title="New ShortLink"
            desc="Create a brand new architected URL in seconds."
          />
          <Card
            icon={<Layers className="w-6 h-6 text-indigo-500" strokeWidth={1.8} />}
            title="Developer API"
            desc="Integrate our link infrastructure into your apps."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-8 py-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
          © 2024 ShortLink. The Digital Architect.
        </span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "API Documentation", "Support"].map(
            (link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-slate-400 hover:text-slate-600 font-medium tracking-wide uppercase transition-colors"
              >
                {link}
              </a>
            )
          )}
        </div>
      </footer>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 w-52 flex-1 min-w-[160px] max-w-[210px]">
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}