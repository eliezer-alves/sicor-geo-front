import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});
