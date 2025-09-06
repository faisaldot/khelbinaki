import axiosInstance from "./axiosInstance";

// Register
export const userCreate =(data:object)=>{
    console.log(data);
   const res=axiosInstance.post("/auth/register",data);
   console.log(res);
   return res;
}


// Verify OTP
export const verifyOtp = async ({ email, otp }) => {
  console.log(email,otp);
  const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
  console.log(res);
  return res.data;
};