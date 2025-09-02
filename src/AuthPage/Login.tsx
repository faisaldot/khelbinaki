import { useForm } from "react-hook-form";
import { useState } from "react";
import Logo from "../../public/KhelbaNakiLogo.png";

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (data: object) => {
    setIsSubmitting(true);
    console.log("Login Data:", data);

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
            "url('https://images6.alphacoders.com/749/749388.jpg')",
        }}
      >
        {/* Optional: add semi-transparent overlay */}
        <div className="absolute inset-0 backdrop-blur-sm"></div>
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
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              {/* Forgot Password Link */}
  <p className="text-right mt-2">
    <a
      href="/forgot-password"
      className="text-sm text-green-600 hover:underline"
    >
      Forgot Password?
    </a>
  </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded font-semibold transition shadow-md ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
              }`}
            >
              {isSubmitting ? "Signing In..." : "SIGN IN"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Right Side (Optional Image Panel) */}
        <div
          className="hidden lg:flex w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images6.alphacoders.com/749/749388.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-green-700/30"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
