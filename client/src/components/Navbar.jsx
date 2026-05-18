import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./features/blogs/auth/authSlice";

const navItems = [
    { label: "Feed", path: "/" },
    { label: "Explore", path: "/explore" },
];

const getProfileImage = (user) => {
    const image = user?.profileImage || user?.profilePic || user?.avatar;
    const fallbackName = encodeURIComponent(user?.name || user?.email || "User");
    return image || `https://ui-avatars.com/api/?name=${fallbackName}&background=111315&color=fff&size=96`;
};

const Navbar = ({ theme = "light", onToggleTheme }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        setMenuOpen(false);
        navigate("/");
    };

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fbfaf5]/92 backdrop-blur-xl">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
                .nav-shell{font-family:'Archivo',sans-serif}
                .nav-display{font-family:'Fraunces',serif}
            `}</style>

            <nav className="nav-shell mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#111315] bg-[#111315] text-sm font-black text-[#f6cf4f] shadow-[4px_4px_0_#f45d48]">
                        MB
                    </span>
                    <span className="nav-display text-2xl leading-none tracking-normal text-[#111315]">MyBlogs</span>
                </Link>

                <div className="hidden items-center gap-1 rounded-full border border-black/10 bg-white p-1 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`rounded-full px-4 py-2 text-sm font-black transition ${isActive(item.path) ? "bg-[#111315] text-white" : "text-zinc-500 hover:text-[#111315]"}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/UserProfilePage"
                            className={`rounded-full px-4 py-2 text-sm font-black transition ${isActive("/UserProfilePage") ? "bg-[#263bff] text-white" : "text-zinc-500 hover:text-[#111315]"}`}
                        >
                            Profile
                        </Link>
                    )}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        className="group flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 text-sm font-black text-[#111315] transition hover:border-[#111315] dark-theme-aware"
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#111315] text-xs text-white">
                            {theme === "dark" ? "LT" : "DK"}
                        </span>
                        <span className="pr-2">{theme === "dark" ? "Light" : "Dark"}</span>
                    </button>

                    {user ? (
                        <>
                            <Link to="/createPost" className="rounded-full bg-[#f6cf4f] px-5 py-2.5 text-sm font-black text-[#111315] transition hover:bg-[#1ccad8]">
                                Write
                            </Link>
                            <Link to="/UserProfilePage" className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 pr-4">
                                <img src={getProfileImage(user)} alt={user.name || "Profile"} className="h-8 w-8 rounded-full object-cover" />
                                <span className="max-w-[120px] truncate text-sm font-black text-[#111315]">{user.name}</span>
                            </Link>
                            <button type="button" onClick={handleLogout} className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-black text-zinc-500 transition hover:border-[#f45d48] hover:text-[#f45d48]">
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="rounded-full px-4 py-2.5 text-sm font-black text-zinc-600 transition hover:text-[#111315]">
                                Sign in
                            </Link>
                            <Link to="/register" className="rounded-full bg-[#111315] px-5 py-2.5 text-sm font-black text-white shadow-[4px_4px_0_#1ccad8] transition hover:bg-[#263bff]">
                                Start
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen(open => !open)}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-black text-[#111315] md:hidden"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? "Close" : "Menu"}
                </button>
            </nav>

            {menuOpen && (
                <div className="nav-shell border-t border-black/10 bg-[#fbfaf5] px-4 py-4 md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2">
                        {[...navItems, ...(user ? [{ label: "Profile", path: "/UserProfilePage" }] : [])].map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMenuOpen(false)}
                                className={`rounded-2xl px-4 py-3 text-sm font-black ${isActive(item.path) ? "bg-[#111315] text-white" : "bg-white text-zinc-600"}`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <button
                            type="button"
                            onClick={onToggleTheme}
                            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-black text-[#111315]"
                        >
                            Switch to {theme === "dark" ? "light" : "dark"} theme
                        </button>

                        {user ? (
                            <>
                                <Link to="/createPost" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-[#f6cf4f] px-4 py-3 text-sm font-black text-[#111315]">
                                    Write new post
                                </Link>
                                <button type="button" onClick={handleLogout} className="rounded-2xl bg-[#f45d48] px-4 py-3 text-left text-sm font-black text-white">
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-[#111315]">
                                    Sign in
                                </Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-2xl bg-[#111315] px-4 py-3 text-center text-sm font-black text-white">
                                    Start
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
