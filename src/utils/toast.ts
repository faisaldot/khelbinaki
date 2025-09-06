import toast from "react-hot-toast";

// Success Toast
export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      border: "1px solid #047857", // green-700
      padding: "16px",
      color: "#047857",
    },
    iconTheme: {
      primary: "#047857",
      secondary: "#ECFDF5", // green-50
    },
  });
};

// Error Toast
export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      border: "1px solid #b91c1c", // red-700
      padding: "16px",
      color: "#b91c1c",
    },
    iconTheme: {
      primary: "#b91c1c",
      secondary: "#FEE2E2", // red-100
    },
  });
};
