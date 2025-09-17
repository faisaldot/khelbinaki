import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Contact from "../Pages/Contact";
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
import  { BookingSuccessPage } from "../Pages/PaymentSuccess";
import  { BookingFailedPage } from "../Pages/PaymentFaild";
import ForgotPassword from "../AuthPage/ForgetPassword";
import { ResetPassword } from "../AuthPage/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import { BookingCancelledPage } from "../Pages/PaymentCancel";
import ManagerStatistics from "../Dasboard/ManagerDashboard/ManagerStatistics";
import ManageTurfs from "../Dasboard/ManagerDashboard/ManageTurfs";
import ManageUsers from "../Dasboard/ManagerDashboard/ManageUsers";
import CreateAdmin from "../Dasboard/ManagerDashboard/CreateAdmin";
import CreateTurfs from "../Dasboard/ManagerDashboard/CreateTurfs";


 const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,



    // public route   ------------>
    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/contact",
        element:<Contact/>
      },
      {
        path:"/about",
        element:<AboutUs/>
      },
      {
        path:"/turfs/:slug",
        element:<TurfDetails/>
      },
      {
        path:"/gallery",
        element:<Gallery/>
      },
      {
        path:"/turfs",
        element:<Turfs/>
      },

    ]
  },
  
  

 // user Privet Route --------->
  {
    path:"/dashboard",
    element:<DashboardLayout/>,
    children:[
      {
        path:"/dashboard/profile",
        element:
        <ProtectedRoute>
          <Profile/>
        </ProtectedRoute>
      },
      {
        path:"/dashboard/my-bookings",
        element:<MyBookings/>
      },




      // admin route ------------>
      {
        path:"/dashboard/admin/statistic",
        element:<AdminStatistic/>
      },
      {
        path:"/dashboard/admin/turfs",
        element:<AdminTurfManagement/>
      },
      {
        path:"/dashboard/admin/bookings",
        element:<AdminBookingManagement/>
      },
      
      // manager route -------------->
      {
        path:"/dashboard/manager/statistics",
        element:<ManagerStatistics/>,
      },
      {
        path:"/dashboard/manager/turfs",
        element:<ManageTurfs/>,
      },
      {
        path:"/dashboard/manager/users",
        element:<ManageUsers/>,
      },
      {
        path:"/dashboard/manager/admin-create",
        element:<CreateAdmin/>,
      },
      {
        path:"/dashboard/manager/create-turf",
        element:<CreateTurfs/>,
      },


    ]
  },





  // Auth page  -------------->
  {
    path:"/auth/register",
    element:<Register/>
  },
  {
    path:"/auth/verify-otp",
    element:<VerifyEmail/>
  },
  {
    path:"/auth/login",
    element:<Login/>
  },
  {
    path:"/auth/forget-password",
    element:<ForgotPassword/>
  },
  {
    path:"/reset-password/:token",
    element:<ResetPassword/>
  },

  // Payment error Page
  
    {
    path:"/booking-success",
    element:<BookingSuccessPage/>
  },
  
    {
    path:"/booking-failed",
    element:<BookingFailedPage/>
  },
    {
    path:"/booking-cancelled",
    element:<BookingCancelledPage/>
  },


  {
  path: "*",
  element: <NotFound />
}

]);
export default router;