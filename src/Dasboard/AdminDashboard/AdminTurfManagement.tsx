import { useState } from "react";

const AdminTurfManagement = () => {
  const [turfs, setTurfs] = useState([
    {
      id: 1,
      name: "GreenField Arena",
      location: "Dhaka, Bangladesh",
      turfType: "5-a-side",
      surface: "Artificial Grass",
      priceDay: "৳600/hr",
      priceNight: "৳800/hr",
      image:
        "https://d3mt0x61rkkfy3.cloudfront.net/page_element/109/original/bg-image/1668430576-football-turf-header.jpg",
    },
    {
      id: 2,
      name: "Skyline Turf",
      location: "Chattogram, Bangladesh",
      turfType: "7-a-side",
      surface: "Natural Grass",
      priceDay: "৳700/hr",
      priceNight: "৳900/hr",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2023/8/338096314/RQ/ES/VH/160544017/green-artificial-sports-football-field-turf.jpg",
    },
  ]);

  const handleDelete = (id: number) => {
    setTurfs(turfs.filter((turf) => turf.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Turf Management</h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 text-left border-b">Image</th>
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b">Location</th>
              <th className="p-3 text-left border-b">Type</th>
              <th className="p-3 text-left border-b">Surface</th>
              <th className="p-3 text-left border-b">Day Price</th>
              <th className="p-3 text-left border-b">Night Price</th>
              <th className="p-3 text-center border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {turfs.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-20 h-14 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 border-b font-semibold">{t.name}</td>
                <td className="p-3 border-b">{t.location}</td>
                <td className="p-3 border-b">{t.turfType}</td>
                <td className="p-3 border-b">{t.surface}</td>
                <td className="p-3 border-b font-medium text-green-600">
                  {t.priceDay}
                </td>
                <td className="p-3 border-b font-medium text-blue-600">
                  {t.priceNight}
                </td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {turfs.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-4 text-gray-500 italic"
                >
                  No turfs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTurfManagement;
