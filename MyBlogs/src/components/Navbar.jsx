import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoaderTwo from "./LoaderTwo";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./features/blogs/auth/authSlice";





const Navbar = ({ setPage, searchQuery, setSearchQuery }) => {

    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const handleLogout = () => {

        dispatch(logoutUser())
    }






    // ── Navbar ───────────────────────────────────────────────────────────────────
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (


        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">


            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to={"/"}>
                    <button className="flex items-center gap-2 flex-shrink-0">
                        <div className="cursor-pointer w-12 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">M-bg</span>
                        </div>
                        <span className="font-black text-xl tracking-tight text-gray-900 cursor-pointer">MyBlogs</span>
                    </button>
                </Link>

                {/* Desktop Nav */}

                <div className="hidden md:flex items-center gap-1">





                    <Link to={"/"}>
                        <button
                            className="  py-2 cursor-pointer text-gray-500 hover:text-gray-900 hover:bg-gray-50"                        >
                            Feed
                        </button>

                    </Link>

                    <Link to={"/explore"}>
                        <button
                            className=" px-4 py-2 cursor-pointer text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Explore
                        </button>

                    </Link>



                    {user ? (
                        <Link to={"/UserProfilePage"}>
                            <p className=' font-semibold text-red-500   text-gray-500 hover:text-red-700   '>  Welcome ! {user.name} </p>
                        </Link>

                    ) : (<Link to={"/createPost"}>
                        <button className="  py-2 cursor-pointer text-gray-500 hover:text-gray-900 hover:bg-gray-50">  Create Post  </button>
                    </Link>)

                    }






                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    {searchOpen ? (
                        <div className="flex items-center  gap-2 bg-gray-100 rounded-xl px-3 py-1.5">
                            <svg className="w-4 h-4  text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search posts…"
                                className=" bg-transparent text-sm outline-none w-40 text-gray-800 placeholder-gray-400"
                            />
                            <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className=" cursor-pointer text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                    ) : (
                        <button onClick={() => setSearchOpen(true)} className="p-2 cursor-pointer rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </button>
                    )}

                    {user ? (
                        <>
                            <Link to={"/createPost"}>
                                <button

                                    className="hidden md:flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                                >
                                    <span className="text-lg leading-none">+</span> New Blog
                                </button>

                            </Link>

                            <button onClick={handleLogout} className=" md:block text-sm  text-white cursor-pointer rounded-xl bg-red-700 px-4 py-2  font-semibold hover:bg-red-900 font-medium transition-colors ">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to={"/login"}>

                                <button className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors">
                                    Sign In
                                </button>
                            </Link>


                            <Link to={"/register"}>

                                <button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile hamburger */}

                    <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>

                    </button>



                </div>
            </div>

            {/* Mobile Menu */}

            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-2">
                    {user ? (
                        <>

                            <Link to={"/createPost"}>
                                <button

                                    className=" md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                                >
                                    <span className="text-lg leading-none">+</span> New Blog
                                </button>
                            </Link>

                            <button onClick={handleLogout} className=" md:block text-sm  text-white cursor-pointer rounded-xl bg-red-700 px-4 py-2  font-semibold hover:bg-red-900 font-medium transition-colors">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to={"/login"}>
                                <button
                                    className=" cursor-pointer text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                                    Sign In
                                </button>

                            </Link>
                            <Link to={"/register"}>
                                <button
                                    className=" cursor-pointer bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl w-full justify-center text-center mt-1">
                                    Get Started
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}



        </nav>
    );
}




export default Navbar;