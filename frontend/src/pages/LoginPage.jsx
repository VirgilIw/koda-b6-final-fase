import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

export default function LoginPage() {
  const [form, setForm] = React.useState({
    showPassword: false,
    email: "",
    password: "",
    loading: false,
    error: null,
    success: false,
  });

  const handleLogin = async () => {
    setForm((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      localStorage.setItem("token", data.token);

      setForm((prev) => ({
        ...prev,
        success: true,
      }));
    } catch (err) {
      setForm((prev) => ({ ...prev, error: err.message }));
    } finally {
      setForm((prev) => ({ ...prev, loading: false }));
    }
  };

  React.useEffect(() => {
    if (form.success) {
      const timer = setTimeout(() => {
        setForm((prev) => ({
          ...prev,
          success: false,
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [form.success]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-100 via-gray-200 to-gray-100">
      <div className="absolute top-6 left-8 text-sm text-gray-400">
        Login Page
      </div>
      {form.success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-xl bg-white px-6 py-4 text-sm font-medium text-green-600 shadow-lg">
            Login berhasil!
          </div>
        </div>
      )}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-800">
          ShortLink
        </h1>

        <h2 className="text-lg font-semibold text-gray-800">Welcome Back</h2>
        <p className="mb-6 text-sm text-gray-400">
          Please enter your details to sign in.
        </p>

        {/* ERROR */}
        {form.error && (
          <div className="mb-4 text-sm text-red-500">{form.error}</div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm text-gray-600">Password</label>
            <button className="text-xs text-indigo-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <input
              type={form.showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  showPassword: !prev.showPassword,
                }))
              }
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
            >
              {form.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={form.loading}
          className="mt-4 w-full rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {form.loading ? "Loading..." : "Log In →"}
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="grow border-t border-gray-200" />
          <span className="mx-3 text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="grow border-t border-gray-200" />
        </div>

        {/* Google Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm transition hover:bg-gray-50">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-4 w-4"
          />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?
          <Link to="/register" className="cursor-pointer text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Bottom Links */}
      <div className="absolute bottom-4 flex w-full justify-between px-10 text-xs text-gray-400">
        <span>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</span>
        <div className="flex gap-6">
          <span>PRIVACY POLICY</span>
          <span>TERMS OF SERVICE</span>
          <span>API DOCUMENTATION</span>
          <span>SUPPORT</span>
        </div>
      </div>
    </div>
  );
}
