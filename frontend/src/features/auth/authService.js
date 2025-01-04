import axios from "axios"
import { jwtDecode } from "jwt-decode"
const API_URL = "/api/v1"

async function login(userData) {
    const response = await axios.post(`${API_URL}/login`, userData)
    
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    const token = response.data.token

    return jwtDecode(token)
}

async function logout() {
    localStorage.removeItem("user")
}

export default {
    login,
    logout
}