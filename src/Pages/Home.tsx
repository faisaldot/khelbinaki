import BookingShort from "../Components/BookingShort";
import Slider from "../Components/Slider";
import TurfList from "../Components/TurfList";
import { useAuth } from "../Hooks/useAuth";
// import type { useAuth } from "../Hooks/useAuth";

const Home = () => {
    const {user}=useAuth();
    console.log("get user------>",user);
    return (
        <div className="w-full">
         <Slider/>
         <BookingShort/>
         <TurfList/>
        </div>
    )
}
export default Home;