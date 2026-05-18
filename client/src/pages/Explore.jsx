import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../components/features/blogs/blogSlice";
import LoaderTwo from "../components/LoaderTwo";

const coverImages = [
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
];

const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "popular", label: "Most liked" },
    { value: "discussed", label: "Most discussed" },
];

const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";

    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getCommentCount = (blog) => {
    if (Array.isArray(blog.comments)) return blog.comments.length;
    return Number(blog.comments) || 0;
};

const getLikeCount = (blog) => Number(blog.likes) || 0;

const getCoverImage = (blog, index) => {
    return blog.image || coverImages[index % coverImages.length];
};

const getExcerpt = (blog) => {
    const text = blog.description || blog.content || "No preview available.";
    return text.length > 180 ? `${text.slice(0, 180).trim()}...` : text;
};

const getReadTime = (blog) => {
    if (blog.readTime) return blog.readTime;

    const text = `${blog.title || ""} ${blog.description || ""} ${blog.content || ""}`;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const getCategory = (blog) => {
    if (blog.category) return blog.category;
    if (Array.isArray(blog.tags) && blog.tags.length > 0) return blog.tags[0];
    return "General";
};

const ExplorePage = () => {
    const dispatch = useDispatch();
    const { blogs, blogLoading, blogError, blogErrorMessage } = useSelector((state) => state.blog);
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [sortBy, setSortBy] = useState("latest");

    useEffect(() => {
        dispatch(getBlogs());
    }, [dispatch]);

    useEffect(() => {
        if (blogError && blogErrorMessage) {
            toast.error(blogErrorMessage);
        }
    }, [blogError, blogErrorMessage]);

    const allBlogs = Array.isArray(blogs) ? blogs : [];
    const categories = ["All", ...Array.from(new Set(allBlogs.map(getCategory).filter(Boolean)))];
    const normalizedQuery = query.trim().toLowerCase();

    const visibleBlogs = allBlogs
        .filter((blog) => {
            const category = getCategory(blog);
            const matchesCategory = activeCategory === "All" || category === activeCategory;
            const searchableText = [
                blog.title,
                blog.author,
                blog.description,
                blog.content,
                category,
                ...(Array.isArray(blog.tags) ? blog.tags : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
        })
        .sort((first, second) => {
            if (sortBy === "popular") return getLikeCount(second) - getLikeCount(first);
            if (sortBy === "discussed") return getCommentCount(second) - getCommentCount(first);
            return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
        });

    const featuredPost = visibleBlogs[0] || allBlogs[0];
    const sidePosts = visibleBlogs.slice(1, 4);
    const gridPosts = visibleBlogs.slice(featuredPost ? 1 : 0);
    const totalLikes = allBlogs.reduce((total, blog) => total + getLikeCount(blog), 0);
    const totalComments = allBlogs.reduce((total, blog) => total + getCommentCount(blog), 0);

    return (
        <main className="min-h-screen bg-[#f4f5f0] text-zinc-950">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Sora:wght@400;500;600;700;800&display=swap');
                .explore-shell{font-family:'Sora',sans-serif}
                .explore-display{font-family:'Instrument Serif',serif}
                .grain:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.22;background-image:radial-gradient(circle at 1px 1px,rgba(24,24,27,.18) 1px,transparent 0);background-size:18px 18px;mix-blend-mode:multiply}
                .story-card{content-visibility:auto;contain-intrinsic-size:420px}
                .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
            `}</style>

            <section className="explore-shell relative overflow-hidden">
                <div className="grain absolute inset-0" />
                <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="rounded-[2rem] border border-zinc-950 bg-zinc-950 p-4 text-white shadow-[10px_10px_0_#c7ff35] sm:p-6">
                            <div className="grid min-h-[440px] gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <p className="mb-5 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#c7ff35]">
                                            Explore
                                        </p>
                                        <h1 className="explore-display max-w-3xl text-5xl leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
                                            Find the story worth your next ten minutes.
                                        </h1>
                                    </div>

                                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                        {[
                                            { label: "Stories", value: allBlogs.length },
                                            { label: "Likes", value: totalLikes },
                                            { label: "Comments", value: totalComments },
                                        ].map((item) => (
                                            <div key={item.label} className="border-t border-white/20 pt-3">
                                                <p className="text-3xl font-black text-[#c7ff35]">{item.value}</p>
                                                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/55">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between rounded-[1.5rem] bg-white p-4 text-zinc-950">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Browse control</p>
                                        <div className="mt-4">
                                            <label htmlFor="explore-search" className="sr-only">Search stories</label>
                                            <input
                                                id="explore-search"
                                                value={query}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder="Search title, author, tag"
                                                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-900 outline-none transition focus:border-zinc-950 focus:bg-white"
                                            />
                                        </div>

                                        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-zinc-100 p-1">
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setSortBy(option.value)}
                                                    className={`rounded-xl px-2 py-2 text-xs font-black transition ${sortBy === option.value ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-950"}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Sections</p>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => setActiveCategory(category)}
                                                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${activeCategory === category ? "border-zinc-950 bg-[#c7ff35] text-zinc-950" : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-950 hover:text-zinc-950"}`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <aside className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Now showing</p>
                                    <p className="mt-1 text-2xl font-black text-zinc-950">{visibleBlogs.length}</p>
                                </div>
                                <div className="rounded-full bg-[#ff5c39] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
                                    Live
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {(sidePosts.length > 0 ? sidePosts : allBlogs.slice(0, 3)).map((blog, index) => (
                                    <Link
                                        key={blog._id}
                                        to={`/singleProfile/${blog._id}`}
                                        className="group grid grid-cols-[72px_1fr] gap-3 rounded-2xl border border-zinc-100 p-2 transition hover:border-zinc-950 hover:bg-zinc-50"
                                    >
                                        <img
                                            src={getCoverImage(blog, index + 1)}
                                            alt={blog.title}
                                            loading="lazy"
                                            className="h-20 w-full rounded-xl object-cover"
                                        />
                                        <div className="min-w-0 py-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff5c39]">{getCategory(blog)}</p>
                                            <h2 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-zinc-950 group-hover:underline">
                                                {blog.title}
                                            </h2>
                                            <p className="mt-1 text-xs font-semibold text-zinc-400">{formatDate(blog.createdAt)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    </div>

                    {blogError && (
                        <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                            <p className="font-black">Could not load explore feed.</p>
                            <p className="mt-1 text-sm">{blogErrorMessage || "Try again after checking the backend."}</p>
                        </div>
                    )}

                    {blogLoading && allBlogs.length === 0 ? (
                        <div className="py-14">
                            <LoaderTwo />
                        </div>
                    ) : visibleBlogs.length === 0 ? (
                        <div className="mt-8 rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center">
                            <p className="explore-display text-4xl text-zinc-950">No matching stories.</p>
                            <p className="mt-2 text-sm font-medium text-zinc-500">Clear the search or switch the section.</p>
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
                            {featuredPost && (
                                <Link
                                    to={`/singleProfile/${featuredPost._id}`}
                                    className="group relative min-h-[520px] overflow-hidden rounded-[2rem] border border-zinc-950 bg-zinc-950 shadow-[8px_8px_0_#ff5c39]"
                                >
                                    <img
                                        src={getCoverImage(featuredPost, 0)}
                                        alt={featuredPost.title}
                                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-[#c7ff35] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-zinc-950">
                                                Featured
                                            </span>
                                            <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white/90">
                                                {getCategory(featuredPost)}
                                            </span>
                                        </div>
                                        <h2 className="explore-display max-w-3xl text-5xl leading-[0.92] sm:text-6xl">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/80 sm:text-base">
                                            {getExcerpt(featuredPost)}
                                        </p>
                                        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.16em] text-white/75">
                                            <span>{featuredPost.author || "Unknown author"}</span>
                                            <span>{formatDate(featuredPost.createdAt)}</span>
                                            <span>{getReadTime(featuredPost)}</span>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            <div className="grid gap-5 sm:grid-cols-2">
                                {gridPosts.map((blog, index) => (
                                    <Link
                                        key={blog._id}
                                        to={`/singleProfile/${blog._id}`}
                                        className="story-card group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-950 hover:shadow-[7px_7px_0_#c7ff35]"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
                                            <img
                                                src={getCoverImage(blog, index + 2)}
                                                alt={blog.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-zinc-950 backdrop-blur">
                                                {getCategory(blog)}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center justify-between gap-3 text-xs font-bold text-zinc-400">
                                                <span>{blog.author || "Unknown author"}</span>
                                                <span>{getReadTime(blog)}</span>
                                            </div>
                                            <h2 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-zinc-950">
                                                {blog.title}
                                            </h2>
                                            <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-zinc-500">
                                                {getExcerpt(blog)}
                                            </p>
                                            <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                                                <span>{getLikeCount(blog)} likes</span>
                                                <span>{getCommentCount(blog)} comments</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default ExplorePage;
