import { useState } from "react";
import { BarChart2, Link2, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const [state, setState] = useState({
    url: "",
    shortUrl: "",
    error: null,
    copied: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  const handleProtectedAction = async () => {
    setState((prev) => ({ ...prev, error: null }));

    if (!state.url) {
      setState((prev) => ({
        ...prev,
        error: "URL tidak boleh kosong",
      }));
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_url: state.url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat link");
      }

      setState((prev) => ({
        ...prev,
        shortUrl: data.result.short_url,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err.message,
      }));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.shortUrl);

      setState((prev) => ({ ...prev, copied: true }));

      setTimeout(() => {
        setState((prev) => ({ ...prev, copied: false }));
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      {/* Hero */}
      <section className="flex flex-col items-center bg-slate-50 px-6 py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
          Shorten URLs. <span className="text-[#004AC6]">Share Easily.</span>
        </h1>

        <p className="mb-8 max-w-md text-base text-slate-500">
          Create short, memorable links for your team communications.
        </p>

        <div className="mb-10 flex gap-3">
          <button
            onClick={handleProtectedAction}
            className="rounded-lg bg-[#004AC6] px-5 py-2.5 text-sm text-white hover:bg-indigo-700"
          >
            Get Started
          </button>

          <button className="rounded-lg border border-[#004AC6] px-5 py-2.5 text-sm text-[#004AC6] hover:bg-indigo-50">
            Learn More
          </button>
        </div>

        {/* URL Shortener */}
        <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
          <Link2 className="h-4 w-4 text-slate-300" />

          <input
            type="text"
            value={state.url}
            onChange={(e) =>
              setState((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://your-long-url.com"
            className="flex-1 bg-transparent text-sm outline-none"
          />

          <button
            onClick={handleProtectedAction}
            className="rounded-lg bg-[#004AC6] px-4 py-1.5 text-sm text-white hover:bg-indigo-700"
          >
            Shorten
          </button>
        </div>

        {state.error && (
          <p className="mt-2 text-sm text-red-500">{state.error}</p>
        )}

        {state.shortUrl && (
          <div className="mt-4 text-sm text-blue-600">
            Short URL:
            <a
              href={state.shortUrl}
              target="_blank"
              className="ml-1 underline"
            >
              {state.shortUrl}
            </a>

            <button
              onClick={handleCopy}
              className="ml-2 text-blue-500 hover:text-blue-900"
            >
              {state.copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <h2 className="mb-10 text-2xl font-bold text-slate-800">
          Built for Enterprise Precision
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
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
      <footer className="mx-auto mt-auto flex justify-between border-t px-8 py-4">
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