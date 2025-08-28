const TurfDetails = () => {
  // Placeholder data
  const turf = {
    name: "GreenField Arena",
    description: "Premium AstroTurf with floodlights, seating, and snack bar.",
    location: "Dhaka, Bangladesh",
    images: [
      "https://d3mt0x61rkkfy3.cloudfront.net/page_element/109/original/bg-image/1668430576-football-turf-header.jpg",
      "https://5.imimg.com/data5/SELLER/Default/2023/8/338096314/RQ/ES/VH/160544017/green-artificial-sports-football-field-turf.jpg",
      "https://en.reformsports.com/oxegrebi/2020/09/mini-futbol-sahasi-ozellikleri-ve-olculeri.jpg",
    ],
    turfType: "5-a-side",
    surface: "Artificial Grass",
    lighting: "Day & Night",
    parking: "Yes, ample",
    priceDay: "৳600/hr",
    priceNight: "৳800/hr",
    facilities: ["Washrooms", "Showers", "Cafeteria", "Locker Room"],
  };

  return (
    <div className="max-w-6xl  mx-auto py-12 text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
        <img
          src={turf.images[0]}
          alt="Turf main"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute bottom-10 left-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {turf.name}
          </h1>
          <p className="text-lg md:text-xl text-green-100 mt-3 font-medium">
            {turf.location}
          </p>
        </div>
      </div>

      {/* Info + Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 px-4">
        {/* About Turf */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-700">About</h2>
          <p className="leading-relaxed text-gray-700">{turf.description}</p>
          <ul className="space-y-2 text-gray-600">
            <li>
              <strong>Turf Type:</strong> {turf.turfType}
            </li>
            <li>
              <strong>Surface:</strong> {turf.surface}
            </li>
            <li>
              <strong>Lighting:</strong> {turf.lighting}
            </li>
            <li>
              <strong>Parking:</strong> {turf.parking}
            </li>
          </ul>

          <div className="flex flex-wrap gap-2 mt-4">
            {turf.facilities.map((f) => (
              <span
                key={f}
                className="bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* Pricing & CTA */}
        <section className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-md space-y-4">
          <h2 className="text-2xl font-bold text-green-700">Pricing</h2>
          <div className="flex justify-between text-lg">
            <p>Day Rate:</p>
            <p className="font-bold text-green-800">{turf.priceDay}</p>
          </div>
          <div className="flex justify-between text-lg">
            <p>Night Rate:</p>
            <p className="font-bold text-green-800">{turf.priceNight}</p>
          </div>
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded text-lg font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg">
            Book Now
          </button>
        </section>
      </div>

      {/* Gallery */}
      <section className="mt-12 px-4">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {turf.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Turf ${idx}`}
              className="w-full h-44 object-cover rounded-xl shadow-sm hover:scale-105 hover:shadow-lg transition"
            />
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-12 px-4">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">Location</h2>
        <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="turf location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d491.04831547210233!2d91.39913691966511!3d23.009892486677433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753429e88a352f7%3A0xdf9547cb76f03b88!2sFeni!5e0!3m2!1sen!2sbd!4v1756313134795!5m2!1sen!2sbd"
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default TurfDetails;
