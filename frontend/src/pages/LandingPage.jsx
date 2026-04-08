import { useState } from "react";
import { BarChart2, Link2, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export default function LandingPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-3 border-b border-slate-100">
        <div className="flex items-center gap-8">
          <span className="font-bold text-[#004AC6] text-lg tracking-tight">ShortLink</span>
          <div className="hidden md:flex gap-6 text-sm text-slate-500">
            <a href="#" className="text-[#004AC6] border-b-2 [#004AC6] pb-0.5 font-medium">Dashboard</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Features</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Links</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Login</Link>
          <button className="bg-[#004AC6] hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-slate-50 py-20 px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
          Shorten URLs.{" "}
          <span className="text-[#004AC6]">Share Easily.</span>
        </h1>
        <p className="text-slate-500 text-base max-w-md mb-8 leading-relaxed">
          Create short, memorable links for your team communications. Transform
          long, cumbersome URLs into powerful digital assets that drive
          engagement.
        </p>
        <div className="flex gap-3 mb-10">
          <button className="bg-[#004AC6] hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Get Started
          </button>
          <button className="border border-[#004AC6] text-[#004AC6] hover:bg-indigo-50 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Learn More
          </button>
        </div>

        {/* URL Shortener Input */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 w-full max-w-xl shadow-sm">
          <Link2 className="w-4 h-4 text-slate-300 shrink-0" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-long-url-goes-here-and-it-can-be-really-long.com"
            className="flex-1 text-sm text-slate-600 outline-none placeholder-slate-300 bg-transparent"
          />
          <button className="bg-[#004AC6] hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shrink-0">
            Shorten
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <p className="text-xs font-semibold text-[#004AC6] uppercase tracking-widest mb-2">
          Architectural Features
        </p>
        <h2 className="text-2xl font-bold text-slate-800 mb-10">
          Built for Enterprise Precision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Link2 className="w-5 h-5 text-[#004AC6]" strokeWidth={1.8} />}
            title="Easy Create"
            desc="Instantly generate high-performance short links with a single click or through our suggested API endpoints."
          />
          <FeatureCard
            icon={<BarChart2 className="w-5 h-5 text-[#004AC6]" strokeWidth={1.8} />}
            title="Custom Slugs"
            desc="Maintain brand authority with readable, custom link endings that resonate with your digital audience."
          />
          <FeatureCard
            icon={<Users className="w-5 h-5 text-[#004AC6]" strokeWidth={1.8} />}
            title="Team Ready"
            desc="Collaborate across departments with shared workspaces, permissions, and unified analytics dashboards."
            accent
          />
        </div>
      </section>

      {/* Data Insights */}
      <section className="bg-slate-800 mx-6 mb-16 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Image placeholder */}
        <div className="md:w-1/2 bg-slate-700 min-h-56 flex items-center justify-center">
          <div className="w-full h-full bg-linear-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <div className="w-48 h-32 bg-slate-600 rounded-lg flex items-center justify-center border border-slate-500">
              <BarChart2 className="w-12 h-12 text-slate-400" strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Data Driven Insights
          </p>
          <h2 className="text-2xl font-bold text-white mb-4 leading-snug">
            Observe your link architecture in real-time.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            Every click is a data point. Our dashboard provides surgical precision into
            where your traffic originates, who is engaging, and how your team
            communications are performing across the globe.
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "Geographic Distribution Maps",
              "Device & Browser Breakdown",
              "UTM Parameter Tracking",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" strokeWidth={2} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-8 py-4 flex flex-wrap items-center justify-between gap-3 mt-auto">
        <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
          © 2024 ShortLink. The Digital Architect.
        </span>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "API Documentation", "Support"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs text-slate-400 hover:text-slate-600 font-medium tracking-wide uppercase transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, accent }) {
  return (
    <div className={`border rounded-xl p-6 ${accent ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white"}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${accent ? "bg-indigo-100" : "bg-slate-100"}`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      <div className={`mt-4 w-8 h-0.5 rounded-full ${accent ? "bg-indigo-400" : "bg-slate-200"}`} />
    </div>
  );
}