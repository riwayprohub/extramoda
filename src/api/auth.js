import http from "./http.js"

export const register = (data) => http.post("/auth/register", data)
export const login = (data) => http.post("/auth/login", data)
export const getMe = () => http.get("/auth/me")
