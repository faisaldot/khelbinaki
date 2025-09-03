import BookingShort from "../Components/BookingShort";
import Slider from "../Components/Slider";
import TurfList from "../Components/TurfList";

const Home = () => {
    return (
        <div className="w-full">
         <Slider/>
         <BookingShort/>
         <TurfList/>
        </div>
    )
}
export default Home;