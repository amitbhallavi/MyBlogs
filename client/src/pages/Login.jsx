import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../components/features/blogs/auth/authSlice";
import authService from "../components/features/blogs/auth/authService";

const Login = () => {
    const { user, isLoading, isError, message } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.email.trim() || !formData.password) {
            toast.error("Email and password are required");
            return;
        }

        try {
            await dispatch(loginUser(formData)).unwrap();
            navigate("/");
        } catch {
            // Error message is handled by auth state/toast effect.
        }
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = authService.getOAuthRedirectUrl(provider);
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }

        if (isError && message) {
            toast.error(message);
        }
    }, [isError, message, user, navigate]);

    useEffect(() => {
        const error = new URLSearchParams(location.search).get("error");
        if (!error) return;

        if (error === "oauth_email_missing") {
            toast.error("Your provider account does not expose an email address");
            return;
        }

        if (error === "oauth_not_configured") {
            toast.error("OAuth is not configured on the backend");
            return;
        }

        toast.error("Authentication failed. Please try again.");
    }, [location.search]);

    return (
        <main className="min-h-screen bg-[#f7f3ea] text-[#111315]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
                .auth-shell{font-family:'Archivo',sans-serif}
                .auth-display{font-family:'Fraunces',serif}
                .auth-grid{background-image:linear-gradient(rgba(17,19,21,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(17,19,21,.07) 1px,transparent 1px);background-size:34px 34px}
            `}</style>

            <section className="auth-shell auth-grid min-h-screen px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
                    <div className="rounded-[2rem] border border-[#111315] bg-[#111315] p-6 text-white shadow-[9px_9px_0_#1ccad8] sm:p-8">
                        <p className="inline-flex rounded-full border border-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[#ffcf33]">
                            MyBlogs
                        </p>
                        <h1 className="auth-display mt-6 max-w-2xl text-6xl leading-[0.9] tracking-normal sm:text-8xl">
                            Come back to your writing desk.
                        </h1>
                        <p className="mt-6 max-w-xl text-sm font-medium leading-6 text-white/68 sm:text-base">
                            Sign in to publish, edit your posts, manage your profile, and join the discussion from one connected account.
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-[#111315] bg-white p-5 shadow-[8px_8px_0_#ffcf33] sm:p-7">
                        <div className="mb-6">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f45d48]">Sign in</p>
                            <h2 className="auth-display mt-2 text-5xl leading-none tracking-normal">Access account</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => handleOAuthLogin("google")} className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-black transition hover:border-[#111315] hover:bg-[#fbfaf5]">
                                Google
                            </button>
                            <button type="button" onClick={() => handleOAuthLogin("github")} className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-black transition hover:border-[#111315] hover:bg-[#fbfaf5]">
                                GitHub
                            </button>
                        </div>

                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-zinc-200" />
                            <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Email</span>
                            <div className="h-px flex-1 bg-zinc-200" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Email address</label>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white"
                                />
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full rounded-full bg-[#111315] py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff] disabled:cursor-not-allowed disabled:opacity-60">
                                {isLoading ? "Signing in" : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-5 text-center text-sm font-semibold text-zinc-500">
                            No account?{" "}
                            <Link to="/register" className="font-black text-[#263bff] hover:underline">Create one</Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;
