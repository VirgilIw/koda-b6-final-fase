import { useState } from "react";
import { Link2, Eye, Zap, BarChart2, QrCode, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useSelector } from "react-redux";

export default function CreateLinkPage() {
  const [state, setState] = useState({
    destinationUrl: "",
    slug: "",
    loading: false,
    error: null,
    success: null,
    shortUrl: null,
  });

  const previewSlug = state.slug || "my-custom-slug";
  const previewUrl = `https://short.link/${previewSlug}`;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  const handleCreateLink = async () => {
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: null,
    }));

    if (!isAuthenticated) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Kamu harus login dulu",
      }));
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
          original_url: state.destinationUrl,
          slug: state.slug || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat link");
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        success: "Link berhasil dibuat!",
        shortUrl: data.result.short_url,
        destinationUrl: "",
        slug: "",
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.shortUrl);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link
          to="/"
          className="mb-6 flex w-fit items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="mb-1 text-2xl font-bold text-slate-800">
          Create New Short Link
        </h1>
        <p className="mb-8 text-sm text-slate-500">
          Transform your long URLs into clean, manageable assets.
        </p>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8">
          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase">
              Destination URL <span className="text-red-400">*</span>
            </label>

            <div className="flex items-center gap-2 rounded-lg border px-3 py-2.5">
              <Link2 className="h-4 w-4 text-slate-300" />
              <input
                type="text"
                value={state.destinationUrl}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    destinationUrl: e.target.value,
                  }))
                }
                placeholder="https://example.com/your-long-url-here"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-semibold text-slate-500 uppercase">
              Custom Slug
            </label>

            <div className="flex items-center overflow-hidden rounded-lg border">
              <span className="border-r bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                short.link/
              </span>
              <input
                type="text"
                value={state.slug}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    slug: e.target.value,
                  }))
                }
                placeholder="my-custom-slug"
                className="flex-1 px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mb-6 rounded-xl border bg-indigo-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <Eye className="mt-0.5 h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold text-indigo-500 uppercase">
                  Live Preview
                </p>
                <p className="text-sm text-slate-600">{previewUrl}</p>
              </div>
            </div>
          </div>

          {state.error && (
            <p className="mb-4 text-sm text-red-500">{state.error}</p>
          )}

          {state.success && (
            <p className="mb-4 text-sm text-green-600">{state.success}</p>
          )}

          {state.shortUrl && (
            <div className="mb-4 text-sm text-indigo-600">
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
                className="ml-2 text-xs text-indigo-500 hover:text-indigo-800"
              >
                Copy
              </button>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateLink}
              disabled={state.loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {state.loading ? "Creating..." : "Create Link"}
              <Zap className="h-4 w-4" />
            </button>

            <button className="text-sm text-slate-500 hover:text-slate-700">
              Cancel
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoCard
            icon={<BarChart2 className="h-5 w-5 text-orange-500" />}
            iconBg="bg-orange-100"
            title="Real-time Analytics"
            desc="Track every click instantly."
          />
          <InfoCard
            icon={<QrCode className="h-5 w-5 text-indigo-500" />}
            iconBg="bg-indigo-100"
            title="Auto-generated QR"
            desc="Every link gets a QR code."
          />
        </div>
      </main>

      <footer className="flex justify-between border-t bg-white px-8 py-4">
        <span className="text-xs text-slate-400">© 2024 ShortLink</span>
      </footer>
    </div>
  );
}

function InfoCard({ icon, iconBg, title, desc }) {
  return (
    <div className="flex gap-4 rounded-xl border bg-white p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
  );
}