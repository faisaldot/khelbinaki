import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router";

type VerifyFormInputs = {
  code: string;
};

const VerifyEmail: React.FC<{ userEmail: string }> = ({ userEmail }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<VerifyFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: VerifyFormInputs) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: data.code }),
      });

      const result = await res.json();

      if (result.success) {
        navigate("/"); // Redirect to Home page
      } else {
        setErrorMsg("Invalid or expired code.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code we sent to <span className="font-medium">{userEmail}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter verification code"
            {...register("code", { required: "Code is required" })}
            className="w-full px-4 py-3 border rounded focus:ring-2 focus:ring-green-600 outline-none text-center tracking-widest text-lg"
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}

          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded font-semibold transition shadow-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
