import http from "./http.js"

export const getHeroImages = () => http.get("/hero")
export const uploadHeroImages = (formData) => http.post("/hero", formData)
export const deleteHeroImage = (id) => http.delete(`/hero/${id}`)