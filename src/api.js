import axios from "axios";
const ApiManager = axios.create({
  baseURL: "https://localhost:7109/api",
  responseType: "json",
 
});

// ApiManager.interceptors.request.use(config => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => Promise.reject(error));

export default ApiManager;