import React from "react";
import { Link2, Copy, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

export default function LinksPage() {
  const token = useSelector((state) => state.auth.token);

  const { page } = useParams();
  const navigate = useNavigate();

  const currentPage = Number(page) || 1;
  const limit = 4;

  const [links, setLinks] = React.useState([]);
  const [hasNext, setHasNext] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [copiedId, setCopiedId] = React.useState(null);

  const [search, setSearch] = React.useState("");
  const [result, setResult] = React.useState(null);

  // ================= GET ALL LINKS =================
  React.useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/links?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setLinks(data.result || []);
        setHasNext(data.has_next);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLinks();
    }
  }, [currentPage, token]);

  // ================= SEARCH (DEBOUNCE) =================
  React.useEffect(() => {
    const delay = setTimeout(() => {
      if (search) {
        fetchSearch(search);
      } else {
        setResult(null);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  const fetchSearch = async (value) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/links/${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setResult(null);
        return;
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= PAGINATION =================
  const handleNext = () => {
    if (hasNext) {
      navigate(`/links/page/${currentPage + 1}`);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      navigate(`/links/page/${currentPage - 1}`);
    }
  };

  // ================= COPY =================
  const handleCopy = async (url, id) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/links/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setLinks((prev) => prev.filter((link) => link.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HELPERS =================
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

  // ================= LOADING =================
  if (loading) {
    return <div className="p-8 text-sm text-gray-400">Loading...</div>;
  }

  // ================= DATA SOURCE =================
  const displayData = search && result ? [result] : links;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Links</h1>
        <p className="text-sm text-gray-500">
          Manage and track your shortened links
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex items-center rounded-lg border px-3 py-2">
        <input
          placeholder="Search by slug..."
          className="w-full text-sm outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {displayData.length === 0 && (
          <p className="text-sm text-gray-400">No links found</p>
        )}

        {displayData.map((link,id) => {
          const slug = getSlug(link.short_url);
          const displayShort = `${DOMAIN}/${slug}`;

          return (
            <div
              key={id}
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

                <button
                  onClick={() => handleDelete(link.id)}
                  className="rounded-md bg-gray-100 p-2 text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex justify-between text-sm text-gray-500">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          ← Prev
        </button>

        <span>Page {currentPage}</span>

        <button onClick={handleNext} disabled={!hasNext}>
          Next →
        </button>
      </div>
    </div>
  );
}