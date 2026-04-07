export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-linear-to-br from-gray-100 via-gray-200 to-gray-100">
      
      {/* CONTENT */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        
        {/* Logo */}
        <div className="mb-6 text-indigo-600 text-xl">🔗</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Create Account
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Join the elite architects of the web.
        </p>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
          
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              MINIMUM 6 CHARACTERS
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="text-sm text-gray-600 mb-1 block">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-blue-600 hover:opacity-90 transition">
            Sign Up →
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our{" "}
            <span className="text-indigo-600 cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-indigo-600 cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Login Link */}
        <p className="text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            Log in
          </span>
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