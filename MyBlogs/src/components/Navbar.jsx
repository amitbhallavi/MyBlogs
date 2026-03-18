import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./features/blogs/auth/authSlice";

const Navbar = ({ setPage, searchQuery, setSearchQuery }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">

            {/* relative wrapper — needed for absolute center links */}
            <div className="relative max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">

                {/* Logo — left, never shrinks */}
                <Link to={"/"} className="flex-shrink-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-9 sm:w-12 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-xs sm:text-sm">M-bg</span>
                        </div>
                        <span className="font-black text-lg sm:text-xl tracking-tight text-gray-900">MyBlogs</span>
                    </div>
                </Link>

                {/* ✅ Desktop Nav Links — ABSOLUTE CENTER, never moves */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
                    <Link to={"/"}>
                        <button className="px-4 py-2 cursor-pointer text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                            Feed
                        </button>
                    </Link>
                    <Link to={"/explore"}>
                        <button className="px-4 py-2 text-sm cursor-pointer text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                            Explore
                        </button>
                    </Link>
                    {user && (
                        <Link to={"/UserProfilePage"}>
                            <p className="font-semibold text-red-500 hover:text-red-700 px-2 text-sm">
                                Welcome! {user.name}
                            </p>
                        </Link>
                    )}
                </div>

                {/* Right Side — z-10 so it stays above */}
                <div className="flex items-center gap-2 flex-shrink-0 z-10">

                    {/* Search */}
                    <div className="flex items-center">
                        {searchOpen ? (
                            <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-44 sm:w-56 transition-all duration-200">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                <input
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search posts…"
                                    className="bg-transparent text-sm outline-none flex-1 min-w-0 text-gray-800 placeholder-gray-400"
                                />
                                <button
                                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                                    className="cursor-pointer text-gray-400 hover:text-gray-600 flex-shrink-0 text-xs font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 cursor-pointer rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    {user ? (
                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            <Link to={"/createPost"}>
                                <button className="flex items-center gap-1 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                                    <span className="text-base leading-none">+</span> New Blog
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-white cursor-pointer rounded-xl bg-red-700 px-4 py-2 font-semibold hover:bg-red-900 transition-colors whitespace-nowrap"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            <Link to={"/login"}>
                                <button className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap">
                                    Sign In
                                </button>
                            </Link>
                            <Link to={"/register"}>
                                <button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 flex-shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-2">
                    <Link to={"/"} onClick={() => setMenuOpen(false)}>
                        <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            Feed
                        </button>
                    </Link>
                    <Link to={"/explore"} onClick={() => setMenuOpen(false)}>
                        <button className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            Explore
                        </button>
                    </Link>
                    {user ? (
                        <>
                            <Link to={"/UserProfilePage"} onClick={() => setMenuOpen(false)}>
                                <p className="px-4 py-2.5 font-semibold text-red-500 hover:text-red-700 text-sm">
                                    Welcome! {user.name}
                                </p>
                            </Link>
                            <Link to={"/createPost"} onClick={() => setMenuOpen(false)}>
                                <button className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                                    <span className="text-base leading-none">+</span> New Blog
                                </button>
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setMenuOpen(false); }}
                                className="w-full text-sm text-white cursor-pointer rounded-xl bg-red-700 px-4 py-2.5 font-semibold hover:bg-red-900 transition-colors"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to={"/login"} onClick={() => setMenuOpen(false)}>
                                <button className="w-full cursor-pointer text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                                    Sign In
                                </button>
                            </Link>
                            <Link to={"/register"} onClick={() => setMenuOpen(false)}>
                                <button className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center mt-1 transition-colors">
                                    Get Started
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;