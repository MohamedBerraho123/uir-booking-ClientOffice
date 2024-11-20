import axios from "axios";
const ApiSystem = axios.create({
  baseURL: "https://localhost:7125/api",
  responseType: "json",
 
});

ApiSystem.interceptors.request.use(config => {
const token = localStorage.getItem("token");
  // const token = "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default ApiSystem;