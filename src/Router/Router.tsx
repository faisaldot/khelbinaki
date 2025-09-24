import { createBrowserRouter } from "react-router";
 import MainLayout from "../Layouts/MainLayout";
  import Home from "../Pages/Home";
   import TurfDetails from "../Components/TurfDetails"; 
   import AboutUs from "../Pages/AboutUs"; 
   import Register from "../AuthPage/Register";
    import Login from "../AuthPage/Login"; 
    import VerifyEmail from "../AuthPage/VerifyEmail";
     import NotFound from "../Pages/ErrorPage";
      import Gallery from "../Pages/Gallery";
       import Turfs from "../Pages/Turfs";
        import Profile from "../Dasboard/UserPage/Profile";
         import MyBookings from "../Dasboard/UserPage/MyBookings";
          import DashboardLayout from "../Dasboard/Dashboard"; 
          import AdminStatistic from "../Dasboard/AdminDashboard/AdminStatistic"; 
          import AdminBookingManagement from "../Dasboard/AdminDashboard/AdminBookingManagement";
           import AdminTurfManagement from "../Dasboard/AdminDashboard/AdminTurfManagement";
            import { BookingSuccessPage } from "../Pages/PaymentSuccess"
            ; import { BookingFailedPage } from "../Pages/PaymentFaild";
             import ForgotPassword from "../AuthPage/ForgetPassword"; 
             import { ResetPassword } from "../AuthPage/ResetPassword"; 
             import ProtectedRoute from "./ProtectedRoute"; 
             import { BookingCancelledPage } from "../Pages/PaymentCancel";
              import ManagerStatistics from "../Dasboard/ManagerDashboard/ManagerStatistics";
               import ManageTurfs from "../Dasboard/ManagerDashboard/ManageTurfs";
                import ManageUsers from "../Dasboard/ManagerDashboard/ManageUsers"; 
                import CreateAdmin from "../Dasboard/ManagerDashboard/CreateAdmin"; 
                import CreateTurfs from "../Dasboard/ManagerDashboard/CreateTurfs";

                
                 import ContactPage from "../Pages/ContactPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/turfs/:slug",
        element: <TurfDetails />,
      },
      {
        path: "/gallery",
        element: <Gallery />,
      },
      {
        path: "/turfs",
        element: <Turfs />,
      },
    ],
  },

  // private route (user + admin + manager)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // ------- user routes -------
      {
        path: "/dashboard/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/my-bookings",
        element: (
          <ProtectedRoute requiredRole="user">
            <MyBookings />
          </ProtectedRoute>
        ),
      },

      // ------- admin routes -------
      {
        path: "/dashboard/admin/statistic",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminStatistic />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/admin/turfs",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminTurfManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/admin/bookings",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminBookingManagement />
          </ProtectedRoute>
        ),
      },

      // ------- manager routes -------
      {
        path: "/dashboard/manager/statistics",
        element: (
          <ProtectedRoute requiredRole="manager">
            <ManagerStatistics />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/manager/turfs",
        element: (
          <ProtectedRoute requiredRole="manager">
            <ManageTurfs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/manager/users",
        element: (
          <ProtectedRoute requiredRole="manager">
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/manager/create-admin",
        element: (
          <ProtectedRoute requiredRole="manager">
            <CreateAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/manager/create-turf",
        element: (
          <ProtectedRoute requiredRole="manager">
            <CreateTurfs />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Auth page
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/auth/verify-otp",
    element: <VerifyEmail />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/forget-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },

  // Payment error Page
  {
    path: "/booking-success",
    element: <BookingSuccessPage />,
  },
  {
    path: "/booking-failed",
    element: <BookingFailedPage />,
  },
  {
    path: "/booking-cancelled",
    element: <BookingCancelledPage />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
