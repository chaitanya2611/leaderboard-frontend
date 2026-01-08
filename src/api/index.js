import axios from "axios";

const API = axios.create({
  baseURL: "https://genvision-26.onrender.com/api", // backend URL
});

export default API;
