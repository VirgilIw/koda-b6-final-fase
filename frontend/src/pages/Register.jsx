import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    loading: false,
    error: null,
    success: false,
  });

  const handleRegister = async () => {
    // frontend validation
    if (form.password !== form.confirmPassword) {
      setForm((prev) => ({
        ...prev,
        error: "Password tidak sama",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Register gagal");
      }

      setForm((prev) => ({
        ...prev,
        success: true,
      }));
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        error: err.message,
      }));
    } finally {
      setForm((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-linear-to-br from-gray-100 via-gray-200 to-gray-100">
      {/* CONTENT */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-6 text-xl text-indigo-600">🔗</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
        <p className="mb-6 text-sm text-gray-400">
          Join the elite architects of the web.
        </p>

        {/* Card */}
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          {/* ERROR */}
          {form.error && (
            <div className="mb-4 text-sm text-red-500">{form.error}</div>
          )}

          {/* SUCCESS */}
          {form.success && (
            <div className="mb-4 text-sm text-green-500">
              Register berhasil!
            </div>
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
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-600">Password</label>

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

            <p className="mt-1 text-xs text-gray-400">MINIMUM 6 CHARACTERS</p>
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="mb-1 block text-sm text-gray-600">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={form.showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    showConfirmPassword: !prev.showConfirmPassword,
                  }))
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
              >
                {form.showConfirmPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </div>
          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={form.loading}
            className="w-full rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {form.loading ? "Loading..." : "Sign Up →"}
          </button>

          {/* Terms */}
          <p className="mt-4 text-center text-xs text-gray-400">
            By signing up, you agree to our{" "}
            <span className="cursor-pointer text-indigo-600">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer text-indigo-600">
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-sm text-gray-400">
          Already have an account?
          <Link
            to="/login"
            className="cursor-pointer text-indigo-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between px-10 py-4 text-xs text-gray-400">
        <span>© 2024 SHORTLINK. THE DIGITAL ARCHITECT.</span>
        <div className="flex gap-6">
          <span>API DOCUMENTATION</span>
          <span>SUPPORT</span>
        </div>
      </div>
    </div>
  );
}
