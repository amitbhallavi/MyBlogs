import api from "../../../api/axios";


const fetchBlogs = async () => {
    try {
        const response = await api.get("/api/blogs");
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

const fetchMyBlogs = async (token) => {
    const response = await api.get("/api/blogs/my", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return Array.isArray(response.data) ? response.data : []
}


const fetchBlog = async (id) => {
    const response = await api.get(`/api/blogs/${id}`)
    return response.data;
}

const getAuthOptions = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
})

// Create a new blog entry

const createBlog = async (formData, token) => {


    let options = getAuthOptions(token)

    try {
        const response = await api.post("/api/blogs", formData, options,);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


// Remove  a new blog entry - 

const removeBlog = async (blogId, token) => {


    let options = getAuthOptions(token)

    try {
        const response = await api.delete(`/api/blogs/${blogId}`, options,);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }

}

// Update a blog entry

const updateBlog = async (blogId, formData, token) => {

    let options = getAuthOptions(token)

    try {
        const response = await api.put(`/api/blogs/${blogId}`, formData, options,);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }

}

const toggleLike = async (blogId, token) => {
    try {
        const response = await api.patch(`/api/blogs/${blogId}/like`, {}, getAuthOptions(token));
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const addComment = async (blogId, text, token) => {
    try {
        const response = await api.post(`/api/blogs/${blogId}/comments`, { text }, getAuthOptions(token));
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

const deleteComment = async (blogId, commentId, token) => {
    try {
        const response = await api.delete(`/api/blogs/${blogId}/comments/${commentId}`, getAuthOptions(token));
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


const blogService = { fetchBlogs, fetchMyBlogs, fetchBlog, createBlog, removeBlog, updateBlog, toggleLike, addComment, deleteComment };

export default blogService;
