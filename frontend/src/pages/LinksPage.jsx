import React from "react";
import { Link2, Copy, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function LinksPage() {
  const token = useSelector((state) => state.auth.token);

  const [page, setPage] = React.useState(1);
  const limit = 4;

  const [links, setLinks] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  const [copiedId, setCopiedId] = React.useState(null);

  React.useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/links?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        console.log("DATA:", data);

        setLinks(data.result || []);

        if (data.total) {
          setTotalPages(Math.ceil(data.total / limit));
        } else {
          setTotalPages(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [page, token]);

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleCopy = async (url, id) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSlug = (url) => {
    if (!url) return "";
    return url.split("/").pop();
  };

  const DOMAIN = "shrt.link";

  const formatDate = (date) => {
    if (!date || date.startsWith("0001")) return "-";

    return new Date(date)
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  };

  if (loading) {
    return <div className="p-8 text-sm text-gray-400">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Links</h1>
        <p className="text-sm text-gray-500">
          Manage and track your shortened links
        </p>
      </div>

      <div className="mb-6 flex items-center rounded-lg border px-3 py-2">
        <input
          placeholder="Search by name or URL..."
          className="w-full text-sm outline-none"
        />
      </div>

      <div className="space-y-4">
        {links.length === 0 && (
          <p className="text-sm text-gray-400">No links found</p>
        )}

        {links.map((link) => {
          const slug = getSlug(link.short_url);
          const displayShort = `${DOMAIN}/${slug}`;

          return (
            <div
              key={link.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <a
                  href={link.short_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-medium text-blue-600"
                >
                  <Link2 size={16} />
                  {displayShort}
                </a>

                <div className="max-w-md truncate text-sm text-gray-500">
                  {link.original_url}
                </div>

                <div className="mt-1 text-xs text-gray-400">
                  {formatDate(link.created_at)} • {link.click_count} clicks
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(link.short_url, link.id)}
                  className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                >
                  {copiedId === link.id ? "Copied!" : <Copy size={16} />}
                </button>

                <button className="rounded-md bg-gray-100 p-2 text-red-500 hover:bg-red-100">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between text-sm text-gray-500">
        <button onClick={handlePrev} disabled={page === 1}>
          ← Prev
        </button>

        <span>
          {page} of {totalPages}
        </span>

        <button onClick={handleNext} disabled={page === totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
}
