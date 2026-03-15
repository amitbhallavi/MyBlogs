import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blogService from './blogService';

const initialState = {
    blogs: [],
    blog: {},
    blogLoading: false,
    blogError: false,
    blogSuccess: false,
    blogError: false,
    blogErrorMessage: " ",


}

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(getBlogs.pending, (state, action) => {
                state.blogLoading = true
                state.blogError = false
                state.blogSuccess = false
            })
            .addCase(getBlogs.fulfilled, (state, action) => {
                state.blogLoading = false
                state.blogError = false
                state.blogSuccess = true
                state.blogs = action.payload
            })
            .addCase(getBlogs.rejected, (state, action) => {
                state.blogLoading = false
                state.blogSuccess = false
                state.blogError = true
                state.blogErrorMessage = action.payload
            })


            .addCase(getBlog.pending, (state, action) => {
                state.blogLoading = true
                state.blogError = false
                state.blogSuccess = false
            })
            .addCase(getBlog.fulfilled, (state, action) => {
                state.blogLoading = false
                state.blogError = false
                state.blogSuccess = true
                state.blog = action.payload
            })
            .addCase(getBlog.rejected, (state, action) => {
                state.blogLoading = false
                state.blogSuccess = false
                state.blogError = true
                state.blogErrorMessage = action.payload
            })

            // Handle Create Blog

            .addCase(createBlog.pending, (state, action) => {
                state.blogLoading = true
                state.blogError = false
                state.blogSuccess = false
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.blogLoading = false
                state.blogError = false
                state.blogSuccess = true
                state.blogs = [action.payload , ...state.blogs]
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.blogLoading = false
                state.blogSuccess = false
                state.blogError = true
                state.blogErrorMessage = action.payload
            })

            // Handle Remove Blog

            .addCase(removeBlog.pending, (state, action) => {
                state.blogLoading = true
                state.blogError = false
                state.blogSuccess = false
            })
            .addCase(removeBlog.fulfilled, (state, action) => {
                state.blogLoading = false
                state.blogError = false
                state.blogSuccess = true
                state.blogs = state.blogs.filter(blog => blog._id !== action.payload._id)
            })
            .addCase(removeBlog.rejected, (state, action) => {
                state.blogLoading = false
                state.blogSuccess = false
                state.blogError = true
                state.blogErrorMessage = action.payload
            })

            // Handle Update Blog

            .addCase(updateBlog.pending, (state, action) => {
                state.blogLoading = true
                state.blogError = false
                state.blogSuccess = false
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.blogLoading = false
                state.blogError = false
                state.blogSuccess = true
                state.blogs = state.blogs.map(blog => blog._id === action.payload._id ? action.payload : blog)
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.blogLoading = false
                state.blogSuccess = false
                state.blogError = true
                state.blogErrorMessage = action.payload
            })






    }
});


export default blogSlice.reducer


// Get All Blogs

export const getBlogs = createAsyncThunk("FETCH_BLOGS", async (_, thunkAPI) => {

    try {
        const result = await blogService.fetchBlogs();
        return result;

    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data?.message || error.message || "Failed to fetch blogs")
    }

})



//get single blog -> 


export const getBlog = createAsyncThunk("FETCH_BLOG", async (id, thunkAPI) => {

    try {
        return await blogService.fetchBlog(id);

    } catch (error) {
         return thunkAPI.rejectWithValue(error.response.data.message)
    }

})


// Create Blog Entry - No Login Required

export const createBlog = createAsyncThunk("CREATE_BLOG", async (formData, thunkAPI) => {
     
    let token = thunkAPI.getState().auth.user.token
    
       
    try {

        return await blogService.createBlog(formData , token);

    } catch (error) {
         return thunkAPI.rejectWithValue(error.message || "Failed to Create Blog (Unauthorized)")
    }

})


// Remove Blog Entry - No Login Required

export const removeBlog = createAsyncThunk("REMOVE_BLOG", async (blogId, thunkAPI) => {
     
    let token = thunkAPI.getState().auth.user.token
    
       
    try {

        return await blogService.removeBlog(blogId , token);

    } catch (error) {
         return thunkAPI.rejectWithValue(error.message || "Failed to Delete Blogs (Unauthorized)")
    }

})

// Update Blog Entry

export const updateBlog = createAsyncThunk("UPDATE_BLOG", async ({blogId, formData}, thunkAPI) => {
     
    let token = thunkAPI.getState().auth.user.token
    
       
    try {

        return await blogService.updateBlog(blogId, formData, token);

    } catch (error) {
         return thunkAPI.rejectWithValue(error.message || "Failed to Update Blog (Unauthorized)")
    }

})


