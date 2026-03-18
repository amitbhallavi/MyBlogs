import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, removeBlog, createBlog, updateBlog } from "./features/blogs/blogSlice";
import LoaderTwo from "./LoaderTwo";

const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogs, blogLoading, blogError } = useSelector(state => state.blog);
    const { user } = useSelector(state => state.auth);

    const [showEditBlogModal, setShowEditBlogModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBlogTarget, setEditBlogTarget] = useState(null);
    const [editProfile, setEditProfile] = useState(false);

    const [blogFormTitle, setBlogFormTitle] = useState("");
    const [blogFormContent, setBlogFormContent] = useState("");
    const [blogFormImage, setBlogFormImage] = useState("");

    const getProfileImage = () => user?.profileImage || user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=200`;

    const getGenderEmoji = () => {
        if (!user?.gender) return "👤";
        const g = user.gender.toLowerCase();
        if (g === "male" || g === "m") return "👨";
        if (g === "female" || g === "f") return "👩";
        return "👤";
    };

    useEffect(() => { dispatch(getBlogs()); }, [dispatch]);

    useEffect(() => {
        if (!user || !user._id) navigate("/");
    }, [user, navigate]);

    const userBlogs = blogs.filter(blog => {
        if (!user?._id) return false;
        const blogAuthorId = blog.author?._id || blog.authorId || blog.userId;
        const blogAuthorName = blog.author?.name || blog.author;
        const isById = blogAuthorId === user._id;
        const isByName = blogAuthorName && user.name &&
            blogAuthorName.toLowerCase() === user.name.toLowerCase();
        return isById || isByName;
    });

    const handleDeleteBlog = async () => {
        try {
            if (editBlogTarget?._id) {
                await dispatch(removeBlog(editBlogTarget._id));
                setShowDeleteModal(false);
                setEditBlogTarget(null);
                dispatch(getBlogs());
            }
        } catch (err) { console.error(err); }
    };

    const openEditBlog = (blog) => {
        setEditBlogTarget(blog);
        setBlogFormTitle(blog.title || "");
        setBlogFormContent(blog.content || "");
        setBlogFormImage(blog.image || "");
        setShowEditBlogModal(true);
    };

    const confirmDeleteBlog = (blog) => {
        setEditBlogTarget(blog);
        setShowDeleteModal(true);
    };

    const handleSaveEditBlog = async () => {
        if (!blogFormTitle.trim()) return;
        try {
            await dispatch(updateBlog({
                blogId: editBlogTarget._id,
                formData: { title: blogFormTitle, content: blogFormContent, image: blogFormImage }
            }));
            setShowEditBlogModal(false);
            dispatch(getBlogs());
        } catch (err) { console.error(err); }
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
                .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
                ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d97706;border-radius:9px}
                @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                @keyframes modalIn{from{opacity:0;transform:scale(.94) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
                .fade-up{animation:fadeUp .45s ease both}
                .modal-in{animation:modalIn .3s cubic-bezier(.34,1.56,.64,1) both}
            `}</style>

            <div className="min-h-screen bg-slate-50">

                {/* ── PROFILE HERO ── */}
                <div className="relative">

                    {/* Cover Banner */}
                    <div className="h-36 sm:h-56 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="text-9xl select-none">✍️📝📚</div>
                        </div>
                        <div className="absolute top-4 left-8 text-3xl sm:text-4xl animate-bounce">💡</div>
                        <div className="absolute top-4 right-10 text-2xl sm:text-3xl animate-pulse">⭐</div>
                        <div className="absolute bottom-4 left-1/4 text-2xl sm:text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>📖</div>
                        <div className="absolute bottom-3 right-1/4 text-3xl sm:text-4xl animate-pulse" style={{ animationDelay: "0.7s" }}>🎯</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
                    </div>

                    {/* Avatar + Info Row */}
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-10 sm:-mt-14 relative z-10 pb-5 border-b border-zinc-100">

                            {/* Avatar */}
                            <div className="relative shrink-0 self-start sm:self-auto">
                                <img
                                    src={getProfileImage()}
                                    alt="avatar"
                                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-xl object-cover"
                                />
                                <span className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-base sm:text-lg font-black rounded-full shadow-lg flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                                    {getGenderEmoji()}
                                </span>
                            </div>

                            {/* Info — full width on mobile */}
                            <div className="flex-1 min-w-0 mt-1 sm:mt-0 sm:pb-1">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h1 className="text-xl sm:text-2xl bg-white px-4 rounded-full font-black text-zinc-900 leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                                        {user?.name || " "}
                                    </h1>
                                    <span className="text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-2.5 py-0.5 rounded-full">Blogger</span>
                                </div>
                                <p className="text-zinc-500 text-sm mb-1.5">@{user?.email} · Indore, India 🇮🇳</p>
                                <p className="text-zinc-600 text-sm max-w-lg leading-relaxed">
                                    {user?.bio || "Tech enthusiast and blogger. I love sharing my thoughts and experiences."}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {["Writing", "Tech", "Blogging"].map(tag => (
                                        <span key={tag} className="text-xs bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full font-medium border border-zinc-200">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Edit Button — full width on mobile */}
                            <div className="w-full sm:w-auto shrink-0 sm:self-auto sm:pb-1">
                                <button
                                    onClick={() => setEditProfile(true)}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition shadow"
                                >
                                    ✏️ Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── STATS ROW ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up">
                        {[
                            { label: "Blogs", value: userBlogs.length, icon: "📝" },
                            { label: "Following", value: "183", icon: "👥" },
                            { label: "Followers", value: "2.1K", icon: "❤️" },
                            { label: "Total Views", value: "15.4K", icon: "👁️" },
                        ].map((s, i) => (
                            <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 shadow-md p-3 sm:p-4 text-center fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                                <p className="text-lg sm:text-xl mb-1">{s.icon}</p>
                                <p className="text-xl sm:text-2xl font-black text-zinc-900">{s.value}</p>
                                <p className="text-zinc-500 text-xs mt-0.5 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BLOGS SECTION ── */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-black text-zinc-900" style={{ fontFamily: "'Playfair Display',serif" }}>
                            📚 My Published Blogs
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">{userBlogs.length} article{userBlogs.length !== 1 ? 's' : ''} published</p>
                    </div>

                    {blogLoading && <LoaderTwo />}

                    {blogError && (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-rose-50 rounded-2xl border border-rose-200">
                            <p className="text-4xl mb-3">⚠️</p>
                            <p className="text-rose-600 font-semibold text-base">Error loading blogs</p>
                            <p className="text-rose-500 text-sm mt-2 max-w-xs text-center px-4">{blogError}</p>
                            <button onClick={() => dispatch(getBlogs())} className="mt-4 px-4 py-2 bg-rose-500 text-white font-bold text-sm rounded-lg hover:bg-rose-600 transition">
                                🔄 Try Again
                            </button>
                        </div>
                    )}

                    {!blogLoading && !blogError && userBlogs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-2xl border border-dashed border-zinc-200 px-4 text-center">
                            <p className="text-5xl sm:text-6xl mb-3">✍️</p>
                            <p className="text-zinc-600 font-semibold text-base">No blogs published yet</p>
                            <p className="text-zinc-400 text-sm mt-2 max-w-xs">Start creating and sharing your thoughts with the community!</p>
                        </div>
                    )}

                    {!blogLoading && !blogError && userBlogs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {userBlogs.map((blog, i) => (
                                <div key={blog._id} className="group bg-white rounded-2xl border border-zinc-100 shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 fade-up" style={{ animationDelay: `${i * 80}ms` }}>

                                    {/* Blog Image */}
                                    <div className="relative h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                                        {blog.image ? (
                                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl text-zinc-300">📄</div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Published</div>

                                        {/* Edit/Delete — hover on desktop, always visible on mobile */}
                                        <div className="absolute inset-0 bg-zinc-900/60 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                            <button onClick={() => openEditBlog(blog)} className="px-3 py-2 bg-amber-400 text-zinc-900 font-bold text-xs rounded-lg hover:bg-amber-300 transition shadow">✏️ Edit</button>
                                            <button onClick={() => confirmDeleteBlog(blog)} className="px-3 py-2 bg-rose-500 text-white font-bold text-xs rounded-lg hover:bg-rose-400 transition shadow">🗑 Delete</button>
                                        </div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-zinc-900 text-sm mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">{blog.title}</h3>
                                        <p className="text-zinc-500 text-xs mb-2">
                                            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently published'}
                                        </p>
                                        <p className="text-zinc-600 text-xs mb-4 line-clamp-2 leading-relaxed">{blog.content || blog.description || 'No description'}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                            <div className="flex gap-3 text-xs text-zinc-500 font-semibold">
                                                <span>❤️ {blog.likes || 0}</span>
                                                <span>💬 {blog.comments?.length || 0}</span>
                                            </div>
                                            <button className="text-xs text-amber-600 font-bold hover:text-amber-700 transition">Read More →</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── EDIT BLOG MODAL ── */}
                {showEditBlogModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div className="modal-in bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                                <div>
                                    <h2 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>Edit Blog Post</h2>
                                    <p className="text-zinc-400 text-xs mt-0.5">Update your blog details</p>
                                </div>
                                <button onClick={() => setShowEditBlogModal(false)} className="w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition flex items-center justify-center text-zinc-600 font-bold text-sm">✕</button>
                            </div>

                            <div className="px-4 sm:px-6 py-5 space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                                {blogFormImage && (
                                    <div className="h-32 sm:h-36 rounded-xl overflow-hidden border border-zinc-200">
                                        <img src={blogFormImage} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Blog Title *</label>
                                    <input value={blogFormTitle} onChange={e => setBlogFormTitle(e.target.value)} placeholder="Enter blog post title"
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Blog Content</label>
                                    <textarea value={blogFormContent} onChange={e => setBlogFormContent(e.target.value)} placeholder="Write your blog content here..." rows={4}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Featured Image URL</label>
                                    <input value={blogFormImage} onChange={e => setBlogFormImage(e.target.value)} placeholder="https://your-image-url.com/photo.jpg"
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                </div>
                            </div>

                            <div className="px-4 sm:px-6 py-4 border-t border-zinc-100 flex gap-3">
                                <button onClick={() => setShowEditBlogModal(false)} className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 transition">Cancel</button>
                                <button onClick={handleSaveEditBlog} className="flex-1 py-2.5 bg-amber-400 text-zinc-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition shadow-md shadow-amber-200">Save Changes ✦</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── DELETE CONFIRM MODAL ── */}
                {showDeleteModal && editBlogTarget && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div className="modal-in bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm p-5 sm:p-6 text-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🗑</div>
                            <h2 className="font-black text-zinc-900 text-lg mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>Delete Blog Post?</h2>
                            <p className="text-zinc-500 text-sm mb-5 sm:mb-6 px-2">This will permanently remove this blog post. This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => { setShowDeleteModal(false); setEditBlogTarget(null); }} className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 transition">Keep It</button>
                                <button onClick={handleDeleteBlog} className="flex-1 py-2.5 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-400 transition shadow-md shadow-rose-200">Yes, Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── EDIT PROFILE MODAL ── */}
                {editProfile && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        <div className="modal-in bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                                <h2 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>Edit Profile</h2>
                                <button onClick={() => setEditProfile(false)} className="w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition flex items-center justify-center text-zinc-600 font-bold text-sm">✕</button>
                            </div>

                            <div className="px-4 sm:px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
                                <div className="flex items-center gap-4">
                                    <img src={getProfileImage()} alt={user.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-2 ring-amber-300 object-cover" />
                                    <button className="px-4 py-2 bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl hover:bg-zinc-200 transition">Change Photo</button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Full Name</label>
                                        <input defaultValue={user.name} className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Username</label>
                                        <input defaultValue={`@${user.name}`} className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Bio</label>
                                    <textarea defaultValue={user?.bio || "Tech enthusiast and blogger."} rows={3}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Location</label>
                                    <input defaultValue={user?.location || "Indore, India"} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                </div>
                            </div>

                            <div className="px-4 sm:px-6 py-4 border-t border-zinc-100 flex gap-3">
                                <button onClick={() => setEditProfile(false)} className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 transition">Cancel</button>
                                <button onClick={() => setEditProfile(false)} className="flex-1 py-2.5 bg-amber-400 text-zinc-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition">Save Changes ✦</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UserProfilePage;