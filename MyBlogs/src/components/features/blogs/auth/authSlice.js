import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService';

let userExist = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: userExist || null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: " ",



}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder


            //  Register User -> 
            .addCase(registerUser.pending, (state, action) => {
                state.isError = false,
                    state.isSuccess = false,
                    state.isLoading = true

            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isError = false,
                    state.isSuccess = true,
                    state.user = action.payload,
                    state.isLoading = false,
                    localStorage.setItem('user', JSON.stringify(action.payload))

            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isError = true,
                    state.isSuccess = false,
                    state.isLoading = false,
                    state.message = action.payload

            })

            //  Login Users -> 

            .addCase(loginUser.pending, (state, action) => {
                state.isError = false,
                    state.isSuccess = false,
                    state.isLoading = true

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isError = false,
                    state.isSuccess = true,
                    state.user = action.payload,
                    state.isLoading = false,
                    localStorage.setItem('user', JSON.stringify(action.payload))

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isError = true,
                    state.isSuccess = false,
                    state.isLoading = false,
                    state.message = action.payload

            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isError = false,
                    state.isSuccess = false,
                    state.isLoading = false,
                    state.message = " ",
                    state.user = null


            })
    }
});

export const { } = authSlice.actions

export default authSlice.reducer






// Register user -> 


export const registerUser = createAsyncThunk("AUTH/REGISTER", async (formData, thunkAPI) => {

    try {
        return await authService.register(formData)

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)

    }

})

// Login user -> 


export const loginUser = createAsyncThunk("AUTH/LOGIN", async (formData, thunkAPI) => {

    try {
        return await authService.login(formData)

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message)

    }

})

// Logout user -> 


export const logoutUser = createAsyncThunk("AUTH/LOGOUT", async () => {

    localStorage.removeItem('user')

})