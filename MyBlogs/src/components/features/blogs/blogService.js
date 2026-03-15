import axios from "axios";


const fetchBlogs = async () => {
    try {
        const response = await axios.get("/api/blogs");
        // console.log("🔍 API Response:", response.data);
        
        // Handle different response formats
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data.blogs && Array.isArray(response.data.blogs)) {
            return response.data.blogs;
        } else if (response.data.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            console.warn("⚠️ Unexpected API response format:", response.data);
            return [];
        }
    } catch (error) {
        console.error("❌ Error fetching blogs:", error);
        throw error;
    }
}


const fetchBlog = async (id) => {
    const response = await axios.get(`/api/blogs/${id}`)
    return response.data;
}


// Create a new blog entry - No login required

const createBlog = async (formData, token) => {


    let options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.post("/api/blogs", formData, options,);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


// Remove  a new blog entry - 

const removeBlog = async (blogId, token) => {


    let options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.delete(`/api/blogs/${blogId}`, options,);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }

}

// Update a blog entry

const updateBlog = async (blogId, formData, token) => {

    let options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    try {
        const response = await axios.put(`/api/blogs/${blogId}`, formData, options,);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }

}



const blogService = { fetchBlogs, fetchBlog, createBlog, removeBlog, updateBlog };

export default blogService;
