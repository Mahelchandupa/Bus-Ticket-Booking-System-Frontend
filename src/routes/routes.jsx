import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../helpers/ProtectedRoute";
import Register from "../pages/auth/Register";

const isAuthenticated = () => !!localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute isAuthenticated={isAuthenticated()}>
            <Home />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  }
]);

export default router;
