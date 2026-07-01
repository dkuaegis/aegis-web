import toast from "react-hot-toast";

export const showError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    duration: 2500,
    icon: null,
  });
};

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    duration: 2500,
    icon: null,
  });
};

export const showWarning = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const result = window.confirm(message);
    resolve(result);
  });
};
