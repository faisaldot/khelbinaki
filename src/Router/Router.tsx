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
import UserDashboard from "../Dasboard/UserDashboard";


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
    element:<UserDashboard/>
  },





  // Auth page  -------------->
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/register/verify-email",
    element:<VerifyEmail/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
  path: "*",
  element: <NotFound />
}

]);
export default router;