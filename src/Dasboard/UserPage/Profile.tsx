const ProfileManagement = () => {
  const user = {
    name: "Abdullah Zihad",
    email: "zihad@example.com",
    address: "Dhanmondi, Dhaka",
    number:" 0193948845",
    verified: true,
    photo: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 min-h-screen">
      {/* Left Sidebar */}
      <div className="p-6 flex flex-col items-center">


           {/* Verified Badge (Bottom of Profile) */}
        <div className="mt-6 relative">
          <span
            className={`inline-block text-xs absolute left-5  rounded p-1  ${
              user.verified
                ? "bg-green-200 text-green-800 font-semibold"
                : "bg-red-200 text-red-800 font-semibold"
            }`}
          >
            {user.verified ? "Verified" : "Not Verified"}
          </span>
        </div>





        {/* Profile Photo */}
        {user.photo ? (
          <img
            src={"https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Photo
          </div>


        )}

        {/* Upload Photo Button */}
        <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700  text-white rounded hover:opacity-90 transition">
          Upload Photo
        </button>

        {/* Change Password */}
        <div className="mt-6 w-full">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Old Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-green-500"
          />

          <label className="block text-sm font-medium text-gray-600 mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-green-500"
          />

          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded hover:opacity-90 transition">
            Change Password
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="md:col-span-2 border-0 sm:border-l-2 p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full border rounded px-3 py-2 focus:outline-green-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full border rounded px-3 py-2 focus:outline-green-500"
            />
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              defaultValue={user.address}
              className="w-full border rounded px-3 py-2 focus:outline-green-500"
            />
            <label className="block mt-3 text-sm font-medium text-gray-600 mb-1">
              Number
            </label>
            <input
              type="text"
              defaultValue={user.number}
              className="w-full border rounded px-3 py-2 focus:outline-green-500"
            />
          </div>
        </div>

     

        {/* Edit Profile Button */}
        <button className="mt-6 px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded hover:opacity-90 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileManagement;
