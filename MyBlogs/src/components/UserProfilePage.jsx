import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, removeBlog, createBlog, updateBlog } from "./features/blogs/blogSlice";
import LoaderTwo from "./LoaderTwo";

const UserProfilePage = () => {
    // ── Redux hooks ──
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogs, blogLoading, blogError } = useSelector(state => state.blog);
    const { user } = useSelector(state => state.auth);

    // ── modal states ──
    const [showEditBlogModal, setShowEditBlogModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBlogTarget, setEditBlogTarget] = useState(null);
    const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState(null);
    const [editProfile, setEditProfile] = useState(false);

    // ── blog edit form fields ──
    const [blogFormTitle, setBlogFormTitle] = useState("");
    const [blogFormContent, setBlogFormContent] = useState("");
    const [blogFormImage, setBlogFormImage] = useState("");

    // ── Profile edit form fields ──
    const [profileFormData, setProfileFormData] = useState({
        name: user?.name || "",
        username: user?.username || "",
        bio: user?.bio || "",
        location: user?.location || "",
        gender: user?.gender || "Not specified",
        profileImage: user?.profileImage || user?.avatar || "",
        coverImage: user?.coverImage || "",
    });

    // ── Utility Functions for Profile ──
    const getProfileImage = () => {
        return user?.profileImage || user?.name ;
    };

    const getGenderEmoji = () => {
        if (!user?.gender) return "👤";
        const genderLower = user.gender.toLowerCase();
        if (genderLower === "male" || genderLower === "m") return "👨";
        if (genderLower === "female" || genderLower === "f") return "👩";
        return "👤";
    };

    const getCoverImage = () => {
        return user?.coverImage || "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=60";
    };

    // ── Fetch all blogs on component mount ──
    useEffect(() => {
        dispatch(getBlogs());
    
    }, [dispatch]);

    // ── Filter ONLY current user's blogs ──
    const userBlogs = blogs.filter(blog => {
        if (!user || !user._id) {
            navigate("/")
            return false;
        }
        
        // Try multiple ways to match author
        const blogAuthorId = blog.author?._id || blog.authorId || blog.userId;
        const currentUserId = user._id;
        
        // Also check if author name matches (fallback)
        const blogAuthorName = blog.author?.name || blog.author;
        const currentUserName = user.name || user.username;
        
        const isUserBlogById = blogAuthorId === currentUserId;
        const isUserBlogByName = blogAuthorName && currentUserName && blogAuthorName.toLowerCase() === currentUserName.toLowerCase();
        
        const isUserBlog = isUserBlogById || isUserBlogByName;
        
        // if (isUserBlog) {
        //     console.log("✅ Found user blog:", blog.title, "Author ID:", blogAuthorId, "Author Name:", blogAuthorName);
        // }
        
        return isUserBlog;
    });

    // ── Debug logging ──
    // useEffect(() => {
    //     console.log("🔍 Total blogs in system:", blogs.length);
    //     console.log("👤 Current user ID:", user?._id);
    //     console.log("👤 Current user name:", user?.name);
    //     console.log("📚 User's own blogs:", userBlogs.length);
    //     console.log("📋 All blogs data:", blogs);
    // }, [blogs, user]);

    // Delete blog function
    const handleDeleteBlog = async () => {
        try {
            if (editBlogTarget?._id) {
                await dispatch(removeBlog(editBlogTarget._id));
                setShowDeleteModal(false);
                setEditBlogTarget(null);
                // Re-fetch blogs after deletion
                dispatch(getBlogs());
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    // Open edit blog modal
    const openEditBlog = (blog) => {
        setEditBlogTarget(blog);
        setBlogFormTitle(blog.title || "");
        setBlogFormContent(blog.content || "");
        setBlogFormImage(blog.image || "");
        setShowEditBlogModal(true);
    };

    // Open delete blog confirmation
    const confirmDeleteBlog = (blog) => {
        setEditBlogTarget(blog);
        setShowDeleteModal(true);
    };

    // Save edited blog function
    const handleSaveEditBlog = async () => {
        if (!blogFormTitle.trim()) return;
        try {
            const updatedBlogData = {
                title: blogFormTitle,
                content: blogFormContent,
                image: blogFormImage,
            };
            await dispatch(updateBlog({ blogId: editBlogTarget._id, formData: updatedBlogData }));
            setShowEditBlogModal(false);
            // Re-fetch blogs after update
            dispatch(getBlogs());
        } catch (error) {
            console.error("Error updating blog:", error);
        }
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

                {/* ══════════════════════════════════════════
            PROFILE HERO
        ══════════════════════════════════════════ */}
                <div className="relative">
                    {/* Cover banner with emoji design only */}
                    <div className="h-44 sm:h-56 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex items-center justify-center">
                        {/* Emoji decorations */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="text-9xl select-none">✍️📝📚</div>
                        </div>
                        {/* Floating emojis */}
                        <div className="absolute top-4 left-8 text-4xl animate-bounce">💡</div>
                        <div className="absolute top-6 right-12 text-3xl animate-pulse">⭐</div>
                        <div className="absolute bottom-6 left-1/4 text-3xl animate-bounce" style={{ animationDelay: "0.5s" }}>📖</div>
                        <div className="absolute bottom-4 right-1/4 text-4xl animate-pulse" style={{ animationDelay: "0.7s" }}>🎯</div>
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
                        {/* Amber accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60" />
                    </div>

                    {/* Avatar + name row */}
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 relative z-10 pb-6 border-b border-zinc-100">

                            {/* Avatar with Gender Indicator */}
                            <div className="relative shrink-0">
                                <img src={getProfileImage()} alt="avatar"
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl ring-4 ring-white shadow-xl object-cover" />
                                {/* Gender Badge */}
                                <span className="absolute -bottom-2 -right-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-black px-2.5 py-0.5 rounded-full shadow-lg flex items-center justify-center w-10 h-10">
                                    {getGenderEmoji()}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 pb-1">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                    <h1 className="text-2xl font-black text-white leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
                                        {user?.name || " "}
                                    </h1>
                                    <span className="text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-2.5 py-0.5 rounded-full border border-amber-200">Blogger</span>
                                </div>
                                <p className="text-white text-sm mb-2">@{user?.name } · Indore, India 🇮🇳</p>
                                <p className="text-zinc-600 text-sm max-w-lg">{user?.bio || "Tech enthusiast and blogger. I love sharing my thoughts and experiences through engaging blog posts."}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                    {["Writing", "Tech", "Blogging"].map(tag => (
                                        <span key={tag} className="text-xs bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full font-medium border border-zinc-200">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto sm:pb-1">
                                <button
                                    onClick={() => setEditProfile(true)}
                                    className="px-4 py-2 text-sm font-bold bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition shadow"
                                >
                                    ✏️ Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════
            STATS ROW
        ══════════════════════════════════════════ */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up">
                        {[
                            { label: "Blogs", value: userBlogs.length, icon: "📝" },
                            { label: "Following", value: "183", icon: "👥" },
                            { label: "Followers", value: "2.1K", icon: "❤️" },
                            { label: "Total Views", value: "15.4K", icon: "👁️" },
                        ].map((s, i) => (
                            <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 shadow-md p-4 text-center fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                                <p className="text-xl mb-1">{s.icon}</p>
                                <p className="text-2xl font-black text-zinc-900">{s.value}</p>
                                <p className="text-zinc-500 text-xs mt-0.5 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════
            ALL MY BLOGS SECTION (Featured)
        ══════════════════════════════════════════ */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-black text-zinc-900" style={{ fontFamily: "'Playfair Display',serif" }}>
                            📚 My Published Blogs
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1">{userBlogs.length} article{userBlogs.length !== 1 ? 's' : ''} published</p>
                    </div>

                    {blogLoading && <LoaderTwo />}
                    
                    {blogError && (
                        <div className="flex flex-col items-center justify-center py-16 bg-rose-50 rounded-2xl border border-rose-200">
                            <p className="text-4xl mb-3">⚠️</p>
                            <p className="text-rose-600 font-semibold text-base">Error loading blogs</p>
                            <p className="text-rose-500 text-sm mt-2 max-w-sm text-center">{blogError}</p>
                            <button 
                                onClick={() => dispatch(getBlogs())}
                                className="mt-4 px-4 py-2 bg-rose-500 text-white font-bold text-sm rounded-lg hover:bg-rose-600 transition"
                            >
                                🔄 Try Again
                            </button>
                        </div>
                    )}
                    
                    {!blogLoading && !blogError && userBlogs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-zinc-200">
                            <p className="text-6xl mb-3">✍️</p>
                            <p className="text-zinc-600 font-semibold text-base">No blogs published yet</p>
                            <p className="text-zinc-400 text-sm mt-2 max-w-sm text-center">You haven't published any blogs yet. Start creating and sharing your thoughts with the community!</p>
                        </div>
                    )}
                    
                    {!blogLoading && !blogError && userBlogs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {userBlogs.map((blog, i) => (
                                <div key={blog._id} className="group bg-white rounded-2xl border border-zinc-100 shadow-md overflow-hidden hover:shadow-xl transition hover:-translate-y-1 fade-up relative" style={{ animationDelay: `${i * 80}ms` }}>
                                    {/* Blog image */}
                                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                                        {blog.image ? (
                                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl text-zinc-300">📄</div>
                                        )}
                                        {/* Status badge */}
                                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">Published</div>
                                        {/* Action overlay */}
                                        <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditBlog(blog)}
                                                className="px-3 py-2 bg-amber-400 text-zinc-900 font-bold text-xs rounded-lg hover:bg-amber-300 transition shadow hover:scale-105"
                                            >✏️ Edit</button>
                                            <button
                                                onClick={() => confirmDeleteBlog(blog)}
                                                className="px-3 py-2 bg-rose-500 text-white font-bold text-xs rounded-lg hover:bg-rose-400 transition shadow hover:scale-105"
                                            >🗑 Delete</button>
                                        </div>
                                    </div>

                                    {/* Blog content */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-zinc-900 text-sm mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                            {blog.title}
                                        </h3>
                                        <p className="text-zinc-500 text-xs mb-3">
                                            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently published'}
                                        </p>
                                        <p className="text-zinc-600 text-xs mb-4 line-clamp-2 leading-relaxed">
                                            {blog.content || blog.description || 'No description'}
                                        </p>
                                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                            <div className="flex gap-3 text-xs text-zinc-500 font-semibold">
                                                <span className="flex items-center gap-1">❤️ {blog.likes || 0}</span>
                                                <span className="flex items-center gap-1">💬 {blog.comments?.length || 0}</span>
                                            </div>
                                            <button className="text-xs text-amber-600 font-bold hover:text-amber-700 transition">
                                                Read More →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ══════════════════════════════════════════
            EDIT BLOG MODAL
        ══════════════════════════════════════════ */}
                {showEditBlogModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="modal-in bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                                <div>
                                    <h2 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>
                                        Edit Blog Post
                                    </h2>
                                    <p className="text-zinc-400 text-xs mt-0.5">Update your blog details</p>
                                </div>
                                <button onClick={() => setShowEditBlogModal(false)} className="w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition flex items-center justify-center text-zinc-600 font-bold text-sm">✕</button>
                            </div>

                            {/* Form */}
                            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                                {/* Image preview */}
                                {blogFormImage && (
                                    <div className="h-36 rounded-xl overflow-hidden border border-zinc-200">
                                        <img src={blogFormImage} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Blog Title *</label>
                                    <input
                                        value={blogFormTitle}
                                        onChange={e => setBlogFormTitle(e.target.value)}
                                        placeholder="Enter blog post title"
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Blog Content</label>
                                    <textarea
                                        value={blogFormContent}
                                        onChange={e => setBlogFormContent(e.target.value)}
                                        placeholder="Write your blog content here..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Featured Image URL</label>
                                    <input
                                        value={blogFormImage}
                                        onChange={e => setBlogFormImage(e.target.value)}
                                        placeholder="https://your-image-url.com/photo.jpg"
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                                    />
                                    <p className="text-zinc-400 text-xs mt-1">Paste a public image URL — it will preview above.</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">
                                <button onClick={() => setShowEditBlogModal(false)} className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 transition">Cancel</button>
                                <button onClick={handleSaveEditBlog} className="flex-1 py-2.5 bg-amber-400 text-zinc-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition shadow-md shadow-amber-200">
                                    Save Changes ✦
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
            MODAL: CONFIRM DELETE BLOG
        ══════════════════════════════════════════ */}
                {showDeleteModal && editBlogTarget && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="modal-in bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🗑</div>
                            <h2 className="font-black text-zinc-900 text-lg mb-1" style={{ fontFamily: "'Playfair Display',serif" }}>
                                Delete Blog Post?
                            </h2>
                            <p className="text-zinc-500 text-sm mb-6">
                                This will permanently remove the blog post from your profile. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => { setShowDeleteModal(false); setEditBlogTarget(null); }} className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 transition">Keep It</button>
                                <button 
                                    onClick={handleDeleteBlog} 
                                    className="flex-1 py-2.5 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-400 transition shadow-md shadow-rose-200"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
            MODAL: EDIT PROFILE
        ══════════════════════════════════════════ */}
                {editProfile && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="modal-in bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                                <h2 className="font-black text-zinc-900 text-base" style={{ fontFamily: "'Playfair Display',serif" }}>Edit Profile</h2>
                                <button onClick={() => setEditProfile(false)} className="w-8 h-8 rounded-xl bg-zinc-200 hover:bg-zinc-300 transition flex items-center justify-center text-zinc-600 font-bold text-sm">✕</button>
                            </div>

                            <div className="px-6 py-5 space-y-4">
                                {/* Avatar row */}
                                <div className="flex items-center gap-4">
                                    <img src="https://cdn.dribbble.com/userupload/35980971/file/original-f082b5d3c50b0d45a937613634e5e419.png?resize=1504x1064&vertical=center" alt={user.name} className="w-16 h-16 rounded-2xl ring-2 ring-amber-300" />
                                    <button className="px-4 py-2 bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl hover:bg-zinc-200 transition">Change Photo</button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Full Name</label>
                                        <input defaultValue={user.name}className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Username</label>
                                        <input defaultValue={ `@${user.name}`} className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Bio</label>
                                    <textarea defaultValue="Tech enthusiast and blogger. I love sharing my thoughts and experiences." rows={3}
                                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wide mb-1.5">Location</label>
                                    <input defaultValue="Indore, India" className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">
                                <button onClick={() => setEditProfile(false)} className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-xl hover:bg-zinc-200 transition">Cancel</button>
                                <button onClick={() => setEditProfile(false)} className="flex-1 py-2.5 bg-amber-400 text-zinc-900 font-bold text-sm rounded-xl hover:bg-amber-300 transition">Save Changes ✦</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default UserProfilePage;