import api from "./axios";

export const fetchLogin = params => {
  return api.post("/login", params);
};