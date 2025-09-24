/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import api from "../../lib/api";

// Validation rules
const adminSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .regex(/^\d{11}$/, "Phone must be 11 digits"),
});

type AdminFormData = z.infer<typeof adminSchema>;

const CreateAdminForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminFormData) => {
    try {
      const res = await api.post("admin/users/admin", data);
      toast.success(res.data.message || "Admin created successfully!");
      reset();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create admin";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Admin
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className={`w-full px-5 py-3 border-2 rounded-xl outline-none text-sm transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full px-5 py-3 border-2 rounded-xl outline-none text-sm transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-400"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={`w-full px-5 py-3 border-2 rounded-xl outline-none text-sm pr-12 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder="Phone (11 digits)"
              {...register("phone")}
              className={`w-full px-5 py-3 border-2 rounded-xl outline-none text-sm transition ${
                errors.phone
                  ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-400"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminForm;
