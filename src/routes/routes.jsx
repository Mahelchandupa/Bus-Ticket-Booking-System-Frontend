import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout/Root";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../helpers/ProtectedRoute";
import Register from "../pages/auth/Register";
import SearchResult from "../pages/SearchResult";
import Booking from "../pages/Booking";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchResult />
          </ProtectedRoute>
        ),
      },
      {
        path: "/booking/:scheduleId",
        element: (
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
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
