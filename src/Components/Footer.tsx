import logo from "../../public/KhelbaNakiLogo.png"
const Footer = () => {
    return (
        <div className="w-full bg-gradient-to-r from-green-700 to-green-900 text-white ">
              <footer className="footer mt-16 sm:footer-horizontal p-10 py-20 max-w-[1300px] mx-auto">
  <aside>
    <img src={logo} className="w-25 h-25 -my-2" alt="" />
    <p>
     Your Trusted Partner For Turf Booking <br /> Across Bangladesh  
    </p>
  </aside>
  <nav className="]">
    <h6 className="footer-title text-xl">Quick Link</h6>
    <a className="link link-hover">Book Turf</a>
    <a className="link link-hover">Report Issue</a>
    <a className="link link-hover">Dashboard</a>
    <a className="link link-hover">Contact</a>
  </nav>
  <nav>
    <h6 className="footer-title text-xl">Support</h6>
    <a className="link link-hover">Help Center</a>
    <a className="link link-hover">Privacy and Policy</a>
    <a className="link link-hover">Trams and Condition</a>
    <a className="link link-hover">Refound Policy</a>
  </nav>
  <nav>
    <h6 className="footer-title text-xl">Contact</h6>
    <a className="link link-hover">+880188595895</a>
    <a className="link link-hover">khalbanaki@gmail.com</a>
    <a className="link link-hover">Mirpur-10 Dhaka Bangladesh</a>
  </nav>
</footer>
        </div>
    )
}
export default Footer;