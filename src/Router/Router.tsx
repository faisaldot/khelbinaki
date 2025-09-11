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
import PaymentSuccess from "../Pages/PaymentSuccess";
import PaymentFaild from "../Pages/PaymentFaild";


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
        path:"/turf/:id",
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
        element:<Profile/>
      },
      {
        path:"/dashboard/my-bookings",
        element:<MyBookings/>
      },

      // admin route 
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
      }
    ]
  },





  // Auth page  -------------->
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/verify-otp/:email",
    element:<VerifyEmail/>
  },
  {
    path:"/login",
    element:<Login/>
  },

  // Payment error Page
  
    {
    path:"/payment-success",
    element:<PaymentSuccess/>
  },
  
    {
    path:"/payment-failed",
    element:<PaymentFaild/>
  },


  {
  path: "*",
  element: <NotFound />
}

]);
export default router;