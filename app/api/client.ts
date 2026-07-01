import { getApiBaseUrl } from "@app/lib/apiBaseUrl";
import axios from "axios";

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
