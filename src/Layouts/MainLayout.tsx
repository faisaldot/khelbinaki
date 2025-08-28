import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ScrollToTop from "../utils/ScrollToTop ";

const MainLayout = () => {
    return (
        <div>
            <ScrollToTop/>
            <Navbar/>
           <Outlet/>  
           <Footer/>
        </div>
    )
}
export default MainLayout;