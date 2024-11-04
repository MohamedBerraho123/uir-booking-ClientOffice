import axios from "axios";
const ApiManager = axios.create({
  baseURL: "https://localhost:7125/api",
  responseType: "json",
  withCredentials: false,
});

export default ApiManager;
