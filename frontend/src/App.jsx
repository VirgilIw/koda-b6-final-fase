import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

import store, { persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import PrivateRoute from "./routes/PrivateRoute";
import LinksPage from "./pages/LinksPage";
import MainLayout from "./layout/MainLayout";
import ProfilePage from "./pages/Profile";
import CreateLinkPage from "./pages/CreateLinkPage";

const router = createBrowserRouter([
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/links",
        element: <Navigate to="/links/page/1" />,
      },
      {
        path: "/analytics",
        element: <CreateLinkPage />,
      },
      {
        path: "/links/page/:page",
        element: <LinksPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
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
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
