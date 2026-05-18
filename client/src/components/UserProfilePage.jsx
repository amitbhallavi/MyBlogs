import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyBlogs, removeBlog, updateBlog } from "./features/blogs/blogSlice";
import { fetchCurrentUser, updateCurrentUser } from "./features/blogs/auth/authSlice";
import LoaderTwo from "./LoaderTwo";

const emptyProfileForm = {
    name: "",
    email: "",
    bio: "",
    location: "",
    gender: "",
    profileImage: "",
};

const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "liked", label: "Most liked" },
    { value: "discussed", label: "Discussed" },
];

const toTitleCase = (value) => {
    if (!value) return "";
    return String(value)
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
};

const getCommentCount = (blog) => {
    if (Array.isArray(blog.comments)) return blog.comments.length;
    return Number(blog.comments) || 0;
};

const getLikeCount = (blog) => Number(blog.likes) || 0;

const getReadTime = (blog) => {
    if (blog.readTime) return blog.readTime;

    const text = `${blog.title || ""} ${blog.description || ""} ${blog.content || ""}`;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const getExcerpt = (blog, limit = 170) => {
    const text = blog.description || blog.content || "No preview available.";
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
};

const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";

    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogs, blogLoading, blogError, blogErrorMessage } = useSelector(state => state.blog);
    const { user, isLoading: authLoading } = useSelector(state => state.auth);

    const [showEditBlogModal, setShowEditBlogModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBlogTarget, setEditBlogTarget] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [sortBy, setSortBy] = useState("latest");
    const [query, setQuery] = useState("");

    const [blogFormTitle, setBlogFormTitle] = useState("");
    const [blogFormContent, setBlogFormContent] = useState("");
    const [blogFormImage, setBlogFormImage] = useState("");
    const [profileForm, setProfileForm] = useState(emptyProfileForm);
    const [profileError, setProfileError] = useState("");

    const userId = user?._id;
    const userToken = user?.token;

    const getProfileImage = () => {
        const image = user?.profileImage || user?.profilePic || user?.avatar;
        const fallbackName = encodeURIComponent(user?.name || user?.email || "User");
        return image || `https://ui-avatars.com/api/?name=${fallbackName}&background=111827&color=fff&size=240`;
    };

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        if (userToken) {
            dispatch(fetchCurrentUser());
            dispatch(getMyBlogs());
        }
    }, [dispatch, navigate, userId, userToken]);

    const userBlogs = Array.isArray(blogs) ? blogs : [];
    const normalizedQuery = query.trim().toLowerCase();
    const visibleBlogs = userBlogs
        .filter((blog) => {
            if (!normalizedQuery) return true;

            const searchableText = [
                blog.title,
                blog.description,
                blog.content,
                blog.category,
                ...(Array.isArray(blog.tags) ? blog.tags : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        })
        .sort((first, second) => {
            if (sortBy === "liked") return getLikeCount(second) - getLikeCount(first);
            if (sortBy === "discussed") return getCommentCount(second) - getCommentCount(first);
            return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
        });

    const totalLikes = userBlogs.reduce((total, blog) => total + getLikeCount(blog), 0);
    const totalComments = userBlogs.reduce((total, blog) => total + getCommentCount(blog), 0);
    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Not set";
    const topBlog = [...userBlogs].sort((first, second) => getLikeCount(second) - getLikeCount(first))[0];
    const latestBlog = [...userBlogs].sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0))[0];
    const coverImage = latestBlog?.image || topBlog?.image || "";
    const profileMeta = [user?.email, user?.location].filter(Boolean).join(" / ");
    const profileBadges = [
        user?.role ? toTitleCase(user.role) : null,
        user?.authProvider ? `${toTitleCase(user.authProvider)} login` : null,
        user?.gender ? toTitleCase(user.gender) : null,
    ].filter(Boolean);
    const profileStats = [
        { label: "Published", value: userBlogs.length },
        { label: "Likes", value: totalLikes },
        { label: "Comments", value: totalComments },
        { label: "Since", value: memberSince },
    ];

    const handleDeleteBlog = async () => {
        try {
            if (editBlogTarget?._id) {
                await dispatch(removeBlog(editBlogTarget._id)).unwrap();
                setShowDeleteModal(false);
                setEditBlogTarget(null);
                dispatch(getMyBlogs());
            }
        } catch (err) {
            console.error(err);
        }
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
                formData: { title: blogFormTitle, content: blogFormContent, image: blogFormImage },
            })).unwrap();
            setShowEditBlogModal(false);
            dispatch(getMyBlogs());
        } catch (err) {
            console.error(err);
        }
    };

    const openEditProfile = () => {
        setProfileError("");
        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
            bio: user?.bio || "",
            location: user?.location || "",
            gender: user?.gender || "",
            profileImage: user?.profileImage || user?.profilePic || user?.avatar || "",
        });
        setEditProfile(true);
    };

    const handleProfileFormChange = (event) => {
        const { name, value } = event.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    const closeEditProfile = () => {
        setEditProfile(false);
        setProfileError("");
    };

    const handleSaveProfile = async () => {
        const nextName = profileForm.name.trim();
        const nextEmail = profileForm.email.trim();
        const nextProfileImage = profileForm.profileImage.trim();

        if (!nextName || !nextEmail) {
            setProfileError("Name and email are required.");
            return;
        }

        try {
            await dispatch(updateCurrentUser({
                name: nextName,
                email: nextEmail,
                bio: profileForm.bio.trim(),
                location: profileForm.location.trim(),
                gender: profileForm.gender,
                profileImage: nextProfileImage,
                profilePic: nextProfileImage,
                avatar: nextProfileImage,
            })).unwrap();
            closeEditProfile();
            dispatch(getMyBlogs());
        } catch (err) {
            setProfileError(typeof err === "string" ? err : "Failed to update profile.");
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f3ea] text-[#161616]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&display=swap');
                .profile-shell{font-family:'Epilogue',sans-serif}
                .profile-display{font-family:'Fraunces',serif}
                .profile-grid{background-image:linear-gradient(rgba(22,22,22,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(22,22,22,.07) 1px,transparent 1px);background-size:34px 34px}
                .profile-card{content-visibility:auto;contain-intrinsic-size:360px}
                .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
                @keyframes profileRise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
                @keyframes modalIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
                .profile-rise{animation:profileRise .45s ease both}
                .modal-in{animation:modalIn .24s ease both}
            `}</style>

            <section className="profile-shell profile-grid">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="grid gap-5 lg:grid-cols-[370px_minmax(0,1fr)]">
                        <aside className="lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
                            <div className="flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-[#161616] bg-[#161616] text-white shadow-[9px_9px_0_#f45d48]">
                                <div className="relative h-56 overflow-hidden bg-[#232323]">
                                    {coverImage ? (
                                        <img src={coverImage} alt="" className="h-full w-full object-cover opacity-70" />
                                    ) : (
                                        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,#f6cf4f_0,#f6cf4f_18%,transparent_19%),linear-gradient(135deg,#263bff,#161616_62%)]" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/20 to-transparent" />
                                    <img
                                        src={getProfileImage()}
                                        alt={user?.name || "Profile"}
                                        className="absolute bottom-5 left-5 h-28 w-28 rounded-[1.5rem] border-4 border-white object-cover shadow-2xl"
                                    />
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f6cf4f]">Author profile</p>
                                            <h1 className="profile-display mt-2 break-words text-5xl leading-[0.92] tracking-normal">
                                                {user?.name || "Profile"}
                                            </h1>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={openEditProfile}
                                            className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#161616] transition hover:bg-[#f6cf4f]"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    {profileMeta && <p className="mt-4 break-words text-sm font-semibold leading-6 text-white/68">{profileMeta}</p>}
                                    <p className="mt-4 text-sm font-medium leading-6 text-white/72">
                                        {user?.bio || "No bio added yet."}
                                    </p>

                                    {profileBadges.length > 0 && (
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {profileBadges.map((badge) => (
                                                <span key={badge} className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white/70">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 border-t border-white/10">
                                    {profileStats.map((stat) => (
                                        <div key={stat.label} className="border-b border-r border-white/10 p-4">
                                            <p className="text-2xl font-black text-white">{stat.value}</p>
                                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/42">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="space-y-5">
                            <section className="rounded-[2rem] border border-[#161616] bg-white p-5 shadow-[7px_7px_0_#263bff] sm:p-6">
                                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f45d48]">Writing desk</p>
                                        <h2 className="profile-display mt-2 max-w-3xl text-5xl leading-[0.92] tracking-normal sm:text-6xl">
                                            Your published work, edited from one sharp place.
                                        </h2>
                                    </div>

                                    <div className="flex flex-col justify-between gap-4">
                                        <label htmlFor="profile-search" className="sr-only">Search your posts</label>
                                        <input
                                            id="profile-search"
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            placeholder="Search your posts"
                                            className="w-full rounded-2xl border border-zinc-200 bg-[#f7f3ea] px-4 py-3 text-sm font-bold text-[#161616] outline-none transition focus:border-[#161616] focus:bg-white"
                                        />

                                        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-zinc-100 p-1">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setSortBy(option.value)}
                                                    className={`rounded-xl px-2 py-2 text-xs font-black transition ${sortBy === option.value ? "bg-[#161616] text-white" : "text-zinc-500 hover:text-[#161616]"}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {topBlog && (
                                <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                                    <Link
                                        to={`/singleProfile/${topBlog._id}`}
                                        className="profile-rise group relative min-h-[380px] overflow-hidden rounded-[2rem] border border-[#161616] bg-[#161616] shadow-[7px_7px_0_#f6cf4f]"
                                    >
                                        {topBlog.image ? (
                                            <img src={topBlog.image} alt={topBlog.title} className="absolute inset-0 h-full w-full object-cover opacity-78 transition duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="absolute inset-0 bg-[linear-gradient(135deg,#263bff,#161616_58%,#f45d48)]" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/45 to-transparent" />
                                        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                                            <span className="rounded-full bg-[#f6cf4f] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#161616]">
                                                Top post
                                            </span>
                                            <h3 className="profile-display mt-4 max-w-3xl text-4xl leading-[0.94] sm:text-5xl">
                                                {topBlog.title}
                                            </h3>
                                            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/75">
                                                {getExcerpt(topBlog, 210)}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
                                        <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">Performance</p>
                                        <div className="mt-5 space-y-4">
                                            {[
                                                { label: "Top likes", value: getLikeCount(topBlog) },
                                                { label: "Top comments", value: getCommentCount(topBlog) },
                                                { label: "Read time", value: getReadTime(topBlog) },
                                            ].map((item) => (
                                                <div key={item.label} className="border-b border-zinc-100 pb-4 last:border-b-0 last:pb-0">
                                                    <p className="text-3xl font-black text-[#161616]">{item.value}</p>
                                                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-100 pb-4">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#263bff]">Library</p>
                                        <h2 className="profile-display text-4xl leading-none tracking-normal">Published posts</h2>
                                    </div>
                                    <p className="text-sm font-black text-zinc-500">{visibleBlogs.length} shown</p>
                                </div>

                                {blogLoading && <div className="py-12"><LoaderTwo /></div>}

                                {blogError && (
                                    <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                                        <p className="font-black">Could not load your posts.</p>
                                        <p className="mt-1 text-sm">{blogErrorMessage || "Try again after checking the backend."}</p>
                                        <button type="button" onClick={() => dispatch(getMyBlogs())} className="mt-4 rounded-full bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                                            Retry
                                        </button>
                                    </div>
                                )}

                                {!blogLoading && !blogError && visibleBlogs.length === 0 && (
                                    <div className="py-14 text-center">
                                        <p className="profile-display text-4xl text-[#161616]">No posts found.</p>
                                        <p className="mt-2 text-sm font-semibold text-zinc-500">
                                            {userBlogs.length === 0 ? "Publish your first post to build your library." : "Clear the search or change sorting."}
                                        </p>
                                        <Link to="/createPost" className="mt-5 inline-flex rounded-full bg-[#161616] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff]">
                                            Create post
                                        </Link>
                                    </div>
                                )}

                                {!blogLoading && !blogError && visibleBlogs.length > 0 && (
                                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                                        {visibleBlogs.map((blog, index) => (
                                            <article
                                                key={blog._id}
                                                className="profile-card profile-rise group overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-[#fbfaf5] transition hover:-translate-y-1 hover:border-[#161616] hover:shadow-[6px_6px_0_#f45d48]"
                                                style={{ animationDelay: `${index * 45}ms` }}
                                            >
                                                <Link to={`/singleProfile/${blog._id}`} className="block">
                                                    <div className="relative h-48 overflow-hidden bg-zinc-200">
                                                        {blog.image ? (
                                                            <img src={blog.image} alt={blog.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                                        ) : (
                                                            <div className="h-full w-full bg-[linear-gradient(135deg,#f6cf4f,#fbfaf5_45%,#263bff)]" />
                                                        )}
                                                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#161616] backdrop-blur">
                                                            Published
                                                        </span>
                                                    </div>
                                                </Link>

                                                <div className="p-5">
                                                    <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.14em] text-zinc-400">
                                                        <span>{formatDate(blog.createdAt)}</span>
                                                        <span>{getReadTime(blog)}</span>
                                                    </div>
                                                    <Link to={`/singleProfile/${blog._id}`}>
                                                        <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-[#161616] group-hover:underline">
                                                            {blog.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-zinc-600">
                                                        {getExcerpt(blog)}
                                                    </p>

                                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
                                                        <div className="flex gap-4 text-xs font-black uppercase tracking-[0.14em] text-zinc-500">
                                                            <span>{getLikeCount(blog)} likes</span>
                                                            <span>{getCommentCount(blog)} comments</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditBlog(blog)}
                                                                className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] transition hover:border-[#161616] hover:bg-white"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => confirmDeleteBlog(blog)}
                                                                className="rounded-full bg-[#161616] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#f45d48]"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            {showEditBlogModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="modal-in w-full overflow-hidden rounded-t-[2rem] border border-zinc-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-[2rem]">
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-[#fbfaf5] px-5 py-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#263bff]">Post editor</p>
                                <h2 className="profile-display text-3xl leading-none">Edit post</h2>
                            </div>
                            <button type="button" onClick={() => setShowEditBlogModal(false)} className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:border-[#161616]">
                                Close
                            </button>
                        </div>

                        <div className="max-h-[68vh] space-y-4 overflow-y-auto px-5 py-5">
                            {blogFormImage && (
                                <div className="h-40 overflow-hidden rounded-2xl border border-zinc-200">
                                    <img src={blogFormImage} alt="Preview" className="h-full w-full object-cover" onError={event => { event.currentTarget.style.display = "none"; }} />
                                </div>
                            )}
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Title</label>
                                <input value={blogFormTitle} onChange={event => setBlogFormTitle(event.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Content</label>
                                <textarea value={blogFormContent} onChange={event => setBlogFormContent(event.target.value)} rows={5} className="w-full resize-none rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[#161616] focus:bg-white" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Image URL</label>
                                <input value={blogFormImage} onChange={event => setBlogFormImage(event.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white" />
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-zinc-100 px-5 py-4">
                            <button type="button" onClick={() => setShowEditBlogModal(false)} className="flex-1 rounded-full border border-zinc-300 py-3 text-xs font-black uppercase tracking-[0.16em] transition hover:border-[#161616]">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSaveEditBlog} className="flex-1 rounded-full bg-[#161616] py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff]">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && editBlogTarget && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="modal-in w-full rounded-t-[2rem] border border-zinc-200 bg-white p-6 text-center shadow-2xl sm:max-w-md sm:rounded-[2rem]">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f45d48]">Delete post</p>
                        <h2 className="profile-display mt-2 text-4xl leading-none">Remove this post?</h2>
                        <p className="mx-auto mt-4 max-w-sm text-sm font-medium leading-6 text-zinc-500">
                            This permanently deletes the post from your library. This action cannot be undone.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => { setShowDeleteModal(false); setEditBlogTarget(null); }} className="flex-1 rounded-full border border-zinc-300 py-3 text-xs font-black uppercase tracking-[0.16em] transition hover:border-[#161616]">
                                Keep
                            </button>
                            <button type="button" onClick={handleDeleteBlog} className="flex-1 rounded-full bg-[#f45d48] py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#161616]">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editProfile && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="modal-in w-full overflow-hidden rounded-t-[2rem] border border-zinc-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-[2rem]">
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-[#fbfaf5] px-5 py-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#263bff]">Profile editor</p>
                                <h2 className="profile-display text-3xl leading-none">Edit profile</h2>
                            </div>
                            <button type="button" onClick={closeEditProfile} className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:border-[#161616]">
                                Close
                            </button>
                        </div>

                        <div className="max-h-[68vh] space-y-4 overflow-y-auto px-5 py-5">
                            <div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                                <img src={profileForm.profileImage || getProfileImage()} alt={profileForm.name || user?.name || "Profile"} className="h-24 w-24 rounded-2xl border border-zinc-200 object-cover" />
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Profile image URL</label>
                                    <input name="profileImage" value={profileForm.profileImage} onChange={handleProfileFormChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white" />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Full name</label>
                                    <input name="name" value={profileForm.name} onChange={handleProfileFormChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Email</label>
                                    <input name="email" type="email" value={profileForm.email} onChange={handleProfileFormChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white" />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Bio</label>
                                <textarea name="bio" value={profileForm.bio} onChange={handleProfileFormChange} rows={4} className="w-full resize-none rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[#161616] focus:bg-white" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Location</label>
                                    <input name="location" value={profileForm.location} onChange={handleProfileFormChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Gender</label>
                                    <select name="gender" value={profileForm.gender} onChange={handleProfileFormChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#161616] focus:bg-white">
                                        <option value="">Not set</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {profileError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{profileError}</p>}
                        </div>

                        <div className="flex gap-3 border-t border-zinc-100 px-5 py-4">
                            <button type="button" onClick={closeEditProfile} className="flex-1 rounded-full border border-zinc-300 py-3 text-xs font-black uppercase tracking-[0.16em] transition hover:border-[#161616]">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSaveProfile} disabled={authLoading} className="flex-1 rounded-full bg-[#161616] py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff] disabled:cursor-not-allowed disabled:opacity-60">
                                {authLoading ? "Saving" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default UserProfilePage;
