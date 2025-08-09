import axios from "axios";

const token = localStorage.getItem("auth_token");

const AxiosInstance = axios.create({
  baseURL: "https://api.mv888.xyz/api",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_admin");
      localStorage.removeItem("auth_menu");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
