import api, { buildApiUrl } from "../../../../api/axios";


// Register User -> 


const register = async (formData) => {

    const response = await api.post("/api/auth/register", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data


}

//  Login User -> 

const login = async (formData) => {

    const response = await api.post("/api/auth/login", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data


}

const getCurrentUser = async (token) => {
    const response = await api.get("/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const user = { ...response.data, token }
    localStorage.setItem('user', JSON.stringify(user))
    return user
}

const getOAuthRedirectUrl = (provider) => {
    return buildApiUrl(`/api/auth/${provider}`)
}

const authService = { register , login, getCurrentUser, getOAuthRedirectUrl  }


export default authService;
