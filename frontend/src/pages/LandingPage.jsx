import { useState } from "react";
import { BarChart2, Link2, Users, CheckCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  const handleProtectedAction = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        original_url: url,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setShortUrl(data.result.short_url);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      {/* Hero */}
      <section className="flex flex-col items-center bg-slate-50 px-6 py-20 text-center">
        <h1 className="mb-4 text-4xl leading-tight font-bold text-slate-800 md:text-5xl">
          Shorten URLs. <span className="text-[#004AC6]">Share Easily.</span>
        </h1>

        <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">
          Create short, memorable links for your team communications.
        </p>

        <div className="mb-10 flex gap-3">
          <button
            onClick={handleProtectedAction}
            className="rounded-lg bg-[#004AC6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Get Started
          </button>

          <button className="rounded-lg border border-[#004AC6] px-5 py-2.5 text-sm font-medium text-[#004AC6] transition-colors hover:bg-indigo-50">
            Learn More
          </button>
        </div>

        {/* URL Shortener */}
        <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Link2 className="h-4 w-4 shrink-0 text-slate-300" />

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-long-url.com"
            className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
          />

          <button
            onClick={handleProtectedAction}
            className="shrink-0 rounded-lg bg-[#004AC6] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Shorten
          </button>
        </div>
        {shortUrl && (
          <div className="mt-4 text-sm text-blue-600">
            Short URL:
            <a href={shortUrl} target="_blank" className="underline">
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="ml-2 cursor-pointer text-blue-500 hover:text-blue-900"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-2xl font-bold text-slate-800">
          Built for Enterprise Precision
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Link2 className="h-5 w-5 text-[#004AC6]" />}
            title="Easy Create"
            desc="Generate short links instantly."
          />
          <FeatureCard
            icon={<BarChart2 className="h-5 w-5 text-[#004AC6]" />}
            title="Analytics"
            desc="Track engagement."
          />
          <FeatureCard
            icon={<Users className="h-5 w-5 text-[#004AC6]" />}
            title="Team Ready"
            desc="Collaborate easily."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-auto flex justify-between border-t border-slate-100 px-8 py-4">
        <span className="text-xs text-slate-400">© 2026 ShortLink</span>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}
