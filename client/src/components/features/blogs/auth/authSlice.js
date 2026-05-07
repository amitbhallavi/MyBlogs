import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService';

const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
    } catch {
        localStorage.removeItem('user')
        return null
    }
}

const getErrorMessage = (error, fallback = "Authentication failed. Please try again.") => {
    return error.response?.data?.message || error.message || fallback
}

// Register user ->
export const registerUser = createAsyncThunk("AUTH/REGISTER", async (formData, thunkAPI) => {
    try {
        return await authService.register(formData)
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
})

// Login user ->
export const loginUser = createAsyncThunk("AUTH/LOGIN", async (formData, thunkAPI) => {
    try {
        return await authService.login(formData)
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
})

// OAuth success ->
export const loadOAuthUser = createAsyncThunk("AUTH/OAUTH_SUCCESS", async (token, thunkAPI) => {
    try {
        if (!token) {
            throw new Error("Authentication failed. Please try again.")
        }

        return await authService.getCurrentUser(token)
    } catch (error) {
        localStorage.removeItem('user')
        return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
})

// Logout user ->
export const logoutUser = createAsyncThunk("AUTH/LOGOUT", async () => {
    localStorage.removeItem('user')
})

const initialState = {
    user: getStoredUser(),
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
}

const setPending = (state) => {
    state.isError = false
    state.isSuccess = false
    state.isLoading = true
    state.message = ""
}

const setFulfilled = (state, action) => {
    state.isError = false
    state.isSuccess = true
    state.user = action.payload
    state.isLoading = false
    state.message = ""
    localStorage.setItem('user', JSON.stringify(action.payload))
}

const setRejected = (state, action) => {
    state.isError = true
    state.isSuccess = false
    state.isLoading = false
    state.message = action.payload
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, setPending)
            .addCase(registerUser.fulfilled, setFulfilled)
            .addCase(registerUser.rejected, setRejected)
            .addCase(loginUser.pending, setPending)
            .addCase(loginUser.fulfilled, setFulfilled)
            .addCase(loginUser.rejected, setRejected)
            .addCase(loadOAuthUser.pending, setPending)
            .addCase(loadOAuthUser.fulfilled, setFulfilled)
            .addCase(loadOAuthUser.rejected, setRejected)
            .addCase(logoutUser.fulfilled, (state) => {
                state.isError = false
                state.isSuccess = false
                state.isLoading = false
                state.message = ""
                state.user = null
            })
    }
});

export default authSlice.reducer
