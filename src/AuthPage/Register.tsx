import { useForm } from "react-hook-form";
import { useState } from "react";
import Logo from "../../public/KhelbaNakiLogo.png";
// import { useNavigation } from "react-router";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  // const nav= useNavigation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: object) => {
   window.open("/register/verify-email")
    setIsSubmitting(true);
    console.log("Register Data:", data);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://wallpapers.com/images/hd/soccer-4k-xd29kjrvbr5s4542.jpg')",
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-green-700/30"></div>
      </div>

      {/* Centered Card Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex z-10">
        {/* Left Side (Form) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 lg:px-16 py-12">
          <img
            src={Logo}
            className="w-28 h-28 mx-auto object-contain"
            alt="Logo"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-600 font-medium">Full Name</label>
              <input
                type="text"
                placeholder="User name"
                {...register("name", { required: "Full Name is required" })}
                className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium">E-mail</label>
              <input
                type="email"
                placeholder="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 font-medium">Password</label>
              <input
                type="password"
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-600 font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="********"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-green-600 outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded font-semibold transition shadow-md ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "SIGN UP"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Right Side (Optional Image Panel) */}
        <div
          className="hidden lg:flex w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://wallpapers.com/images/hd/soccer-4k-xd29kjrvbr5s4542.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-green-700/30"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
