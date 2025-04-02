import axios from "axios";

const api = axios.create({
  baseURL: "https://eco-back-fd95.onrender.com/api",
  withCredentials: true, // Important for cookies/JWT authentication
});

export default api;