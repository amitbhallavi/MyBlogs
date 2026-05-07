import { useEffect, useState } from "react";
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../components/features/blogs/auth/authSlice";
import authService from "../components/features/blogs/auth/authService";




const Login = () => {

    const { user, isError, message } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({

        email: "",
        password: "",

    });
    const { email, password } = formData;




    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();




        dispatch(loginUser(formData))


    }

    const handleOAuthLogin = (provider) => {
        window.location.href = authService.getOAuthRedirectUrl(provider)
    }

    useEffect(() => {

        if (user) {
            navigate("/")

        }

        if (isError && message) {
            toast.error(message)
        }


    }, [isError, message, user, navigate])

    useEffect(() => {
        const error = new URLSearchParams(location.search).get("error")
        if (!error) return

        if (error === "oauth_email_missing") {
            toast.error("Your provider account does not expose an email address")
            return
        }

        if (error === "oauth_not_configured") {
            toast.error("OAuth is not configured on the backend")
            return
        }

        toast.error("Authentication failed. Please try again.")
    }, [location.search])



    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <span className="text-white font-black text-lg">G</span>
                        </div>
                        <span className="font-black text-2xl tracking-tight text-gray-900">MyBlogs</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Welcome back!</h1>
                    <p className="text-gray-500 text-sm">Sign in to continue writing your story</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100 p-8">
                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button type="button" onClick={() => handleOAuthLogin("google")} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Google
                        </button>
                        <button type="button" onClick={() => handleOAuthLogin("github")} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                            GitHub
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-gray-100"></div>
                        <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                        <div className="flex-1 h-px bg-gray-100"></div>
                    </div>

                    {/* Error */}
                    {isError && (
                        <div className="mb-4 flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
                            <span>⚠</span> {message}
                        </div>
                    )}

                    {/* Fields */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <button type="button" className="text-xs text-indigo-600 hover:underline font-medium">Forgot password?</button>
                            </div>
                            <div className="relative">
                                <input
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                                />

                            </div>
                        </div>
                        <button

                            type="submit"
                            className="w-full cursor-pointer mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {/* <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                
                            </> */}
                            Signing in…
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-5">
                            Don't have an account?{" "}

                            <Link to={"/register"}>
                                <button type="button" className="cursor-pointer text-indigo-600 font-semibold hover:underline">Create one free</button>

                            </Link>
                        </p>
                    </form>


                </div>
            </div>
        </div>
    )
};


export default Login
