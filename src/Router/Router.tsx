import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home";
import Contact from "../Pages/Contact";
import TurfDetails from "../Components/TurfDetails";
import AboutUs from "../Pages/AboutUs";
import Register from "../AuthPage/Register";
import Login from "../AuthPage/Login";


 const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
      }
    ]
  },
  {
    path:"/register",
    element:<Register/>
  },
  {
    path:"/login",
    element:<Login/>
  }
]);
export default router;