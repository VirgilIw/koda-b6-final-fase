import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

// Dummy page
function Dashboard() {
  return <div className="p-10">Dashboard</div>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/landing-page",
    element: <LandingPage />,
  },
    {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
