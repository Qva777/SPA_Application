import axios from "axios";

const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API_URI || "http://localhost:8000/api",
});

const setAuthToken = (token: string | null) => {
  if (token) {
    axiosConfig.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosConfig.defaults.headers.common['Authorization'];
  }
};

export { axiosConfig, setAuthToken };