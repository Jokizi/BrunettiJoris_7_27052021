import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastTrigger = (status, message) => {
  switch (status) {
    case "error":
      return toast.error(message);
    case "success":
      return toast.success(message);

    default:
      return null;
  }
};
