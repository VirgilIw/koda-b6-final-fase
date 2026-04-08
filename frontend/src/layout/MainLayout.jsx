import { NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/auth.slice";

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `pb-1 border-b-2 transition ${
      isActive
        ? "border-[#004AC6] text-[#004AC6] font-medium"
        : "border-transparent text-slate-500 hover:text-[#004AC6]"
    }`;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-3 border-b border-slate-100">
        <div className="flex items-center gap-8">
          <span className="font-bold text-[#004AC6] text-lg">
            ShortLink
          </span>

          <div className="flex gap-6 text-sm">
            <NavLink to="/" className={navClass}>
              Dashboard
            </NavLink>

            <NavLink to="/links" className={navClass}>
              Links
            </NavLink>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="bg-[#004AC6] text-white px-4 py-1.5 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}