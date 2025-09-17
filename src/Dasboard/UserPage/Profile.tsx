import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import { ProfilePageSkeleton } from "../../Components/ProfilePageSkeleton";
import React, { useState } from "react";
import { toast } from "sonner";
import type { ApiResponse }  from "../../types/api.types";
import api from "../../lib/api";

const ProfileManagement = () => {
  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: user, isError, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("users/me");
      return res.data;
    },
  });



  // Local state for form
  const [formData, setFormData] = useState<{name:string,email:string,address:string,phone:string}>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  // Set formData once user is loaded
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      });
    }
  }, [user]);

  // Mutation for update profile
  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await api.patch<ApiResponse>("/users/me", updatedData);
      return res.data;
    },
    onSuccess: ({message}) => {
      // Refetch profile data after update
      console.log(message);
      queryClient.invalidateQueries(["profile"]);
      toast.success(message)
    },
    onError:({message})=>{
      console.log(message, "Failed to update");
    }
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  if (isLoading) return <ProfilePageSkeleton />;
  if (isError)
    return (
      <p className="text-4xl font-bold my-60 text-center bg-white">
        Failed to load profile
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 min-h-screen">
      {/* Left Sidebar */}
      {/* <div className="p-6 flex flex-col items-center">
      
        <div className="mt-6 relative">
          <span
            className={`inline-block text-xs absolute left-5 rounded p-1 ${
              user?.isActive
                ? "bg-green-200 text-green-800 font-semibold"
                : "bg-red-200 text-red-800 font-semibold"
            }`}
          >
            {user?.isActive ? "Verified" : "Not Verified"}
          </span>
        </div>

     
        {user?.photo ? (
          <img
            src={user?.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Photo
          </div>
        )}

        <button className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700  text-white rounded hover:opacity-90 transition">
          Upload Photo
        </button>


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
      </div> */}

      {/* Right Content */}
     <div className="md:col-span-3 border-0 sm:border-l border-gray-100 bg-gradient-to-br from-white to-gray-50/30 p-8">
  <div className="max-w-4xl mx-auto">
    {/* Header Section */}
    <div className="mb-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
        Profile Information
      </h2>
      <p className="text-gray-600 text-sm">Update your personal details and contact information</p>
    </div>

    {/* Form Container */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 outline-none hover:border-gray-300"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 outline-none hover:border-gray-300"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        {/* Address Field - Full Width */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <div className="relative">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 outline-none hover:border-gray-300"
              placeholder="Enter your complete address"
            />
          </div>
        </div>

        {/* Phone Number Field */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 outline-none hover:border-gray-300"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="group relative px-8 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
        >
          <span className="flex items-center gap-2">
            {mutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Profile...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Profile
              </>
            )}
          </span>
        </button>
      </div>
    </div>

    {/* Additional Info Card */}
    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <h4 className="font-medium text-emerald-800 text-sm">Privacy & Security</h4>
          <p className="text-emerald-700 text-xs mt-1">Your information is encrypted and secure. We'll never share your details with third parties.</p>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default ProfileManagement;
