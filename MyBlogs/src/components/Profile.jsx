// ── Profile Page ──────────────────────────────────────────────────────────────

import React, { useEffect } from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { getBlogs } from '../components/features/blogs/blogSlice';
import LoaderTwo from '../components/LoaderTwo';








const SingleProfileTwo = () => {




   
   





    return (



        <div className="max-w-4xl mx-auto px-4 py-8">


            {/* Profile Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6">


                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
                    <div className={`w-24 h-24  rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg`}>

                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-black"> {" Unknown User "} </h1>
                        <p className="text-indigo-200 text-sm mt-1">@{ "unknownuser"} · Joined Jan 2025 </p>
                        <p className="text-indigo-100 mt-2 text-sm max-w-sm">Travel enthusiast, tech builder, and amateur cook. Writing about life one Blog at a time. 🌍</p>
                    </div>
                    <button className="bg-white text-indigo-600 cursor-pointer font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors flex-shrink-0">
                        Edit Profile
                    </button>



                     <button className="bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-500 transition-colors cursor-pointer flex-shrink-0">
                        Delete Profile
                    </button>


                </div>

               
               
                {/* FORM DATA -> */}


                <div className="  flex flex-col items-center  bg-white rounded-md  gap-4 mt-6 pt-6 border-t border-indigo-400">

                    <div className="  space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <input
                                placeholder="Aryan Mehta"
                                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    placeholder="Min. 6 characters"
                                    className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                                />
                                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                                </button>
                            </div>

                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter your password"
                                className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                            />
                        </div>

                        {/* Terms */}
                        <div>

                        </div>
                        <div className="flex flex-col items-center mb-10">


                            <button className=" px-25  mt-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center  cursor-pointer"
                            >
                                Creating account…
                            </button>

                            

                        </div>


                    </div>






                </div>




               
            </div>






        </div>
    );

}

export default SingleProfileTwo

