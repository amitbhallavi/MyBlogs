import axios from "axios";


// Register User -> 


const register = async (formData) => {

    const response = await axios.post("/api/auth/register", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data


}

//  Login User -> 

const login = async (formData) => {

    const response = await axios.post("/api/auth/login", formData)
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data


}




const authService = { register , login  }


export default authService;