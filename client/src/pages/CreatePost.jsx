import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createBlog, getBlogs } from "../components/features/blogs/blogSlice";

const initialFormData = {
    title: "",
    description: "",
    image: "",
    category: "",
    tags: "",
};

const getReadTime = (text) => {
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const CreatePost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { blogLoading, blogError, blogErrorMessage } = useSelector((state) => state.blog);
    const { user } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState(initialFormData);

    const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
    const canPublish = Boolean(formData.title.trim() && formData.description.trim() && user);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateBlog = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error("Login is required to publish");
            return;
        }

        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error("Title and content are required");
            return;
        }

        const blogData = {
            title: formData.title.trim(),
            content: formData.description.trim(),
            description: formData.description.trim(),
            image: formData.image.trim(),
            category: formData.category.trim(),
            tags: formData.tags,
            readTime: getReadTime(formData.description),
        };

        try {
            const createdBlog = await dispatch(createBlog(blogData)).unwrap();
            toast.success("Post published");
            setFormData(initialFormData);
            dispatch(getBlogs());
            navigate(`/singleProfile/${createdBlog._id}`);
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to publish post");
        }
    };

    return (
        <main className="min-h-screen bg-[#fbfaf5] text-[#111315]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
                .write-shell{font-family:'Archivo',sans-serif}
                .write-display{font-family:'Fraunces',serif}
                .write-grid{background-image:linear-gradient(rgba(17,19,21,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(17,19,21,.06) 1px,transparent 1px);background-size:34px 34px}
            `}</style>

            <section className="write-shell write-grid px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <form onSubmit={handleCreateBlog} className="rounded-[2rem] border border-[#111315] bg-white p-5 shadow-[9px_9px_0_#f6cf4f] sm:p-7">
                        <div className="border-b border-zinc-100 pb-5">
                            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#263bff]">Writer studio</p>
                            <h1 className="write-display mt-3 max-w-4xl text-6xl leading-[0.9] tracking-normal sm:text-8xl">
                                Draft, preview, publish.
                            </h1>
                        </div>

                        {!user && (
                            <div className="mt-5 rounded-3xl border border-[#f45d48]/30 bg-[#fff3ef] p-5">
                                <p className="text-sm font-black text-[#f45d48]">Login required.</p>
                                <p className="mt-1 text-sm font-semibold leading-6 text-zinc-600">
                                    The backend protects publishing. Sign in before creating a post.
                                </p>
                                <Link to="/login" className="mt-4 inline-flex rounded-full bg-[#111315] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">
                                    Sign in
                                </Link>
                            </div>
                        )}

                        <div className="mt-6 space-y-5">
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Write a title that earns the click"
                                    className="w-full rounded-3xl border border-zinc-200 bg-[#fbfaf5] px-5 py-4 text-xl font-black outline-none transition focus:border-[#111315] focus:bg-white"
                                    disabled={!user}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Category</label>
                                    <input
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="Tech, Life, Travel"
                                        className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white"
                                        disabled={!user}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Tags</label>
                                    <input
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        placeholder="comma, separated, tags"
                                        className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white"
                                        disabled={!user}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Featured image URL</label>
                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white"
                                    disabled={!user}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Post body</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Write the full post here..."
                                    rows={14}
                                    className="w-full resize-none rounded-3xl border border-zinc-200 bg-[#fbfaf5] px-5 py-4 text-base font-semibold leading-7 outline-none transition focus:border-[#111315] focus:bg-white"
                                    disabled={!user}
                                />
                            </div>
                        </div>

                        {(blogError || blogErrorMessage) && (
                            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                {blogErrorMessage || "Failed to publish post"}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button type="submit" disabled={!canPublish || blogLoading} className="flex-1 rounded-full bg-[#111315] py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff] disabled:cursor-not-allowed disabled:opacity-60">
                                {blogLoading ? "Publishing" : "Publish post"}
                            </button>
                            <button type="button" onClick={() => setFormData(initialFormData)} className="rounded-full border border-zinc-300 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] transition hover:border-[#111315]">
                                Clear
                            </button>
                        </div>
                    </form>

                    <aside className="space-y-5">
                        <div className="rounded-[2rem] border border-[#111315] bg-[#111315] p-5 text-white shadow-[7px_7px_0_#1ccad8]">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f6cf4f]">Status</p>
                            <h2 className="write-display mt-2 text-5xl leading-none tracking-normal">Ready check</h2>
                            <div className="mt-5 space-y-3 text-sm font-bold text-white/70">
                                <p>{user ? `Author: ${user.name}` : "Author: not signed in"}</p>
                                <p>Words: {wordCount}</p>
                                <p>Read time: {getReadTime(formData.description)}</p>
                                <p>Required: title and body</p>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f45d48]">Live preview</p>
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="mt-4 h-44 w-full rounded-2xl object-cover" onError={event => { event.currentTarget.style.display = "none"; }} />
                            ) : (
                                <div className="mt-4 h-44 rounded-2xl bg-[linear-gradient(135deg,#f6cf4f,#fbfaf5_50%,#263bff)]" />
                            )}
                            <h3 className="mt-4 line-clamp-2 text-2xl font-black leading-tight">{formData.title || "Post title preview"}</h3>
                            <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-zinc-500">
                                {formData.description || "Your post preview will appear here as you write."}
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
};

export default CreatePost;
