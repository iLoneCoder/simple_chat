import axios from "axios"

const API_URL = "/api/v1"

async function login(userData) {
    const response = await axios.post(`${API_URL}/login`, userData)
    
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

async function logout() {
    localStorage.removeItem("user")
}

export default {
    login,
    logout
}