import { configureStore } from "@reduxjs/toolkit";
import blog from "./blogs/blogSlice"
import auth from "./blogs/auth/authSlice"


const store = configureStore({
    reducer: { blog , auth}

})

export default store;