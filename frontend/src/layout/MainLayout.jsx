import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/auth.slice";

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const email = useSelector((state) => state.auth.user?.email);
  const initial = email?.[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    `border-b-2 ${
      isActive
        ? "border-blue-600 text-blue-600"
        : "border-transparent text-gray-500 hover:text-blue-600"
    }`;

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/200 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <h1 className="text-back-600 text-2xl font-extrabold">ShortLink</h1>

          <NavLink to="/" className={navStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/analytics" className={navStyle}>
            Analytics
          </NavLink>
          <NavLink to="/links" className={navStyle}>
            Links
          </NavLink>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              className="flex cursor-pointer items-center gap-2 hover:text-slate-700"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-200 text-xs font-bold">
                {initial}
              </div>
              <span>{email}</span>
            </button>

            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-40 rounded border bg-white shadow"
              >
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full px-3 py-2 text-left cursor-pointer rounded hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 text-left cursor-pointer rounded text-red-500 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-500"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
