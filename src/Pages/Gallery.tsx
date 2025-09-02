const imagesRow1 = [
  "https://images.unsplash.com/photo-1509023464722-18d996393ca8",
  "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b",
  "https://images.unsplash.com/photo-1486286701208-1d58e9338013",
];

const imagesRow2 = [
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d",

  "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9",
  "https://images.unsplash.com/photo-1511988617509-a57c8a288659",
];

const GallerySlider: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      {/* Title */}
      <div className="text-center mb-12">
       <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-green-700">
        Turf <span className="italic text-yellow-500">Images</span>
      </h2>
      <p className="text-lg leading-7  text-gray-500 italic text-center px-3 md:w-2/3 mx-auto  w-full mb-10">Enjoy Our Turf image</p>

      </div>

      {/* Row 1 - Left to Right */}
      <div className="overflow-hidden">
        <div className="flex gap-6 animate-slide-left">
          {[...imagesRow1, ...imagesRow1].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`row1-${i}`}
              className="sm:w-96 w-72 h-48 sm:h-80 object-cover rounded shadow-md"
            />
          ))}
        </div>
      </div>

      {/* Row 2 - Right to Left */}
      <div className="overflow-hidden mt-10">
        <div className="flex gap-6 animate-slide-right">
          {[...imagesRow2, ...imagesRow2].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`row2-${i}`}
              className="sm:w-96 w-72 h-48 sm:h-80 object-cover rounded shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySlider;
