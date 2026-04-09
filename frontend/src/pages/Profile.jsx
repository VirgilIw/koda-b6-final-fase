import React from "react";
import {
  Link2,
  Bell,
  ShieldCheck,
  LogOut,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../redux/slices/auth.slice";
import { Link, useNavigate } from "react-router";

export default function ProfilePage() {
  const [state, setState] = React.useState({
    emailNotif: true,
    user: {},
    image: null,
    preview: null,
    message: "",
    loading: false,
  });

  const dispatch = useDispatch();
  const updateState = (data) => setState((prev) => ({ ...prev, ...data }));
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        updateState({ user: data.result });
        // console.log(data.result);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      updateState({
        image: file,
        preview: URL.createObjectURL(file),
        message: "",
      });
    }
  };

  const handleUpload = async () => {
    if (!state.image) return;

    updateState({ loading: true });

    const formData = new FormData();
    formData.append("image", state.image);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/users/image`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      updateState({
        user: {
          ...state.user,
          image: data.result?.imagePath,
        },
        image: null,
        preview: null,
        loading: false,
        message: "Profile updated",
      });

      dispatch(
        updateUser({
          image: data.result?.imagePath,
        }),
      );

      setTimeout(() => {
        updateState({ message: "" });
      }, 3000);
    } catch (err) {
      console.error(err);
      updateState({
        loading: false,
        message: "Upload failed",
      });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-100 px-4 py-10 font-sans">
      {/* Label */}
      <div className="mb-3 w-full max-w-md">
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Account Management
        </p>
      </div>

      {/* Card */}
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-7">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">Profile</h1>
          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-600 uppercase">
            Pro Member
          </span>
        </div>

        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-indigo-100 bg-indigo-200">
              {state.preview ? (
                <img
                  src={state.preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : state.user?.image ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/images/${state.user.image.split("/").pop()}`}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-indigo-700">
                  {state.user?.name?.charAt(0)}
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="upload-avatar"
                className="hidden"
              />
            </div>
            <label
              htmlFor="upload-avatar"
              className="absolute -right-1 -bottom-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600"
            >
              <Pencil className="h-2.5 w-2.5 text-white" />
            </label>
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800">
              {state.user?.name}
            </p>
            <p className="text-xs text-slate-500">
              Product Architect at Digital Flow
            </p>
          </div>
        </div>

        {state.image && (
          <button
            onClick={handleUpload}
            className="cursor-pointer text-xs text-indigo-600"
          >
            {state.loading ? "Uploading..." : "Save Image"}
          </button>
        )}

        {state.message && (
          <div className="text-xs text-green-600">{state.message}</div>
        )}

        {/* Meta Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Email Address
            </p>
            <p className="text-xs font-medium text-slate-700">
              {state.user?.email}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
              Account Tenure
            </p>
            <p className="text-xs font-medium text-slate-700">
              Member since:{" "}
              {state.user?.created_at &&
                new Date(state.user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </div>
        </div>

        {/* Active Assets Banner */}
        <div className="flex items-center justify-between rounded-xl bg-indigo-600 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500">
              <Link2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest text-indigo-200 uppercase">
                Active Assets
              </p>
              <p className="text-2xl leading-tight font-bold text-white">12</p>
            </div>
          </div>
          <Link
            to="/links"
            className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-indigo-200 uppercase transition-colors hover:text-white"
          >
            View Links
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Settings */}
        <div className="flex flex-col gap-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
              <span className="text-sm text-slate-700">
                Email Notifications
              </span>
            </div>
            <button
              onClick={() => updateState({ emailNotif: !state.emailNotif })}
              className={`relative h-5.5 w-10 rounded-full transition-colors duration-200 ${
                state.emailNotif ? "bg-indigo-500" : "bg-slate-200"
              }`}
              style={{ height: "22px", width: "40px" }}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  state.emailNotif ? "translate-x-4.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="border-t border-slate-100" />

          {/* 2FA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck
                className="h-4 w-4 text-slate-400"
                strokeWidth={1.8}
              />
              <span className="text-sm text-slate-700">
                Two-Factor Authentication
              </span>
            </div>
            <span className="text-xs font-semibold tracking-widest text-red-400 uppercase">
              Disabled
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" />
          Logout Session
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Your data is encrypted using AES-256 standards.{" "}
        <a href="#" className="text-indigo-500 hover:underline">
          Privacy Policy
        </a>
      </p>

      <footer className="mt-10 flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4">
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
          © 2024 ShortLink. The Digital Architect.
        </span>
        <div className="flex gap-5">
          {[
            "Privacy Policy",
            "Terms of Service",
            "API Documentation",
            "Support",
          ].map((l) => (
            <a
              key={l}
              href="#"
              className="text-xs font-medium tracking-wide text-slate-400 uppercase transition-colors hover:text-slate-600"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
