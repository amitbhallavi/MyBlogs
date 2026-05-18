import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../components/features/blogs/blogSlice";
import LoaderTwo from "../components/LoaderTwo";

const fallbackImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
];

const feedModes = [
    { value: "latest", label: "Latest" },
    { value: "trending", label: "Trending" },
    { value: "discussed", label: "Discussed" },
];

const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";

    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getLikeCount = (post) => Number(post.likes) || 0;

const getCommentCount = (post) => {
    if (Array.isArray(post.comments)) return post.comments.length;
    return Number(post.comments) || 0;
};

const getCategory = (post) => {
    if (post.category) return post.category;
    if (Array.isArray(post.tags) && post.tags.length > 0) return post.tags[0];
    return "Field Notes";
};

const getCoverImage = (post, index) => post.image || fallbackImages[index % fallbackImages.length];

const getExcerpt = (post, limit = 170) => {
    const text = post.description || post.content || "No preview available.";
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
};

const getReadTime = (post) => {
    if (post.readTime) return post.readTime;

    const text = `${post.title || ""} ${post.description || ""} ${post.content || ""}`;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const Feed = () => {
    const dispatch = useDispatch();
    const { blogs, blogLoading, blogError, blogErrorMessage } = useSelector((state) => state.blog);
    const [mode, setMode] = useState("latest");
    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(getBlogs());
    }, [dispatch]);

    useEffect(() => {
        if (blogError && blogErrorMessage) {
            toast.error(blogErrorMessage);
        }
    }, [blogError, blogErrorMessage]);

    const posts = Array.isArray(blogs) ? blogs : [];
    const normalizedQuery = query.trim().toLowerCase();
    const filteredPosts = posts
        .filter((post) => {
            if (!normalizedQuery) return true;

            const searchable = [
                post.title,
                post.author,
                post.description,
                post.content,
                getCategory(post),
                ...(Array.isArray(post.tags) ? post.tags : []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchable.includes(normalizedQuery);
        })
        .sort((first, second) => {
            if (mode === "trending") return getLikeCount(second) - getLikeCount(first);
            if (mode === "discussed") return getCommentCount(second) - getCommentCount(first);
            return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
        });

    const heroPost = filteredPosts[0] || posts[0];
    const secondaryPosts = filteredPosts.slice(1, 3);
    const queuePosts = filteredPosts.slice(heroPost ? 1 : 0, 7);
    const latestPosts = [...posts]
        .sort((first, second) => new Date(second.createdAt || 0) - new Date(first.createdAt || 0))
        .slice(0, 4);
    const totalLikes = posts.reduce((total, post) => total + getLikeCount(post), 0);
    const totalComments = posts.reduce((total, post) => total + getCommentCount(post), 0);

    return (
        <main className="min-h-screen bg-[#eef2f3] text-[#111315]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
                .feed-shell{font-family:'Archivo',sans-serif}
                .feed-display{font-family:'DM Serif Display',serif}
                .feed-grid{background-image:linear-gradient(rgba(17,19,21,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(17,19,21,.06) 1px,transparent 1px);background-size:32px 32px}
                .feed-card{content-visibility:auto;contain-intrinsic-size:360px}
                .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
                @keyframes feedRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
                .feed-rise{animation:feedRise .45s ease both}
            `}</style>

            <section className="feed-shell feed-grid">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
                        <aside className="lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
                            <div className="flex h-full flex-col justify-between rounded-[2rem] border border-[#111315] bg-[#111315] p-5 text-white shadow-[9px_9px_0_#1ccad8]">
                                <div>
                                    <div className="inline-flex rounded-full border border-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-[#ffcf33]">
                                        MyBlogs Feed
                                    </div>
                                    <h1 className="feed-display mt-6 text-6xl leading-[0.88] tracking-normal sm:text-7xl">
                                        Read what is moving now.
                                    </h1>
                                    <p className="mt-5 text-sm font-medium leading-6 text-white/65">
                                        A sharper home feed for new essays, active discussions, and posts readers are already reacting to.
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <label htmlFor="feed-search" className="sr-only">Search the feed</label>
                                    <input
                                        id="feed-search"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Search feed"
                                        className="w-full rounded-2xl border border-white/15 bg-white px-4 py-3 text-sm font-bold text-[#111315] outline-none transition placeholder:text-zinc-400 focus:border-[#ffcf33] focus:ring-4 focus:ring-[#ffcf33]/20"
                                    />

                                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-1">
                                        {feedModes.map((item) => (
                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() => setMode(item.value)}
                                                className={`rounded-xl px-2 py-2 text-xs font-black transition ${mode === item.value ? "bg-[#ffcf33] text-[#111315]" : "text-white/55 hover:text-white"}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-3 gap-2">
                                    {[
                                        { label: "Posts", value: posts.length },
                                        { label: "Likes", value: totalLikes },
                                        { label: "Replies", value: totalComments },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                            <p className="text-2xl font-black text-white">{item.value}</p>
                                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">{item.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div>
                            {blogError && (
                                <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                                    <p className="font-black">Feed failed to load.</p>
                                    <p className="mt-1 text-sm">{blogErrorMessage || "Check the backend and try again."}</p>
                                </div>
                            )}

                            {blogLoading && posts.length === 0 ? (
                                <div className="rounded-[2rem] border border-zinc-200 bg-white py-20">
                                    <LoaderTwo />
                                </div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center">
                                    <p className="feed-display text-5xl text-[#111315]">No posts match.</p>
                                    <p className="mt-2 text-sm font-semibold text-zinc-500">Clear search or switch the feed mode.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                                        {heroPost && (
                                            <Link
                                                to={`/singleProfile/${heroPost._id}`}
                                                className="feed-rise group relative min-h-[520px] overflow-hidden rounded-[2rem] border border-[#111315] bg-[#111315] shadow-[8px_8px_0_#ff5a3d]"
                                            >
                                                <img
                                                    src={getCoverImage(heroPost, 0)}
                                                    alt={heroPost.title}
                                                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#111315]/55 to-transparent" />
                                                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-[#ffcf33] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#111315]">
                                                            Lead Story
                                                        </span>
                                                        <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white/90">
                                                            {getCategory(heroPost)}
                                                        </span>
                                                    </div>
                                                    <h2 className="feed-display max-w-4xl text-5xl leading-[0.9] tracking-normal sm:text-7xl">
                                                        {heroPost.title}
                                                    </h2>
                                                    <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-white/78 sm:text-base">
                                                        {getExcerpt(heroPost, 220)}
                                                    </p>
                                                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.16em] text-white/70">
                                                        <span>{heroPost.author || "Unknown author"}</span>
                                                        <span>{formatDate(heroPost.createdAt)}</span>
                                                        <span>{getReadTime(heroPost)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        )}

                                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                                            {secondaryPosts.map((post, index) => (
                                                <Link
                                                    key={post._id}
                                                    to={`/singleProfile/${post._id}`}
                                                    className="feed-rise group overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#111315] hover:shadow-[7px_7px_0_#1ccad8]"
                                                    style={{ animationDelay: `${(index + 1) * 80}ms` }}
                                                >
                                                    <div className="relative h-40 overflow-hidden bg-zinc-200">
                                                        <img
                                                            src={getCoverImage(post, index + 1)}
                                                            alt={post.title}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                        />
                                                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#111315] backdrop-blur">
                                                            {getCategory(post)}
                                                        </span>
                                                    </div>
                                                    <div className="p-5">
                                                        <h2 className="line-clamp-2 text-2xl font-black leading-tight text-[#111315]">
                                                            {post.title}
                                                        </h2>
                                                        <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-zinc-500">
                                                            {getExcerpt(post, 140)}
                                                        </p>
                                                        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                                                            <span>{getLikeCount(post)} likes</span>
                                                            <span>{getCommentCount(post)} replies</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                                        <div className="space-y-4">
                                            <div className="flex items-end justify-between gap-4 border-b border-[#111315]/15 pb-3">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff5a3d]">Reading queue</p>
                                                    <h2 className="feed-display text-4xl leading-none text-[#111315]">Next in line</h2>
                                                </div>
                                                <p className="text-sm font-black text-zinc-500">{filteredPosts.length} found</p>
                                            </div>

                                            {queuePosts.map((post, index) => (
                                                <Link
                                                    key={post._id}
                                                    to={`/singleProfile/${post._id}`}
                                                    className="feed-card feed-rise group grid gap-4 rounded-[1.5rem] border border-zinc-200 bg-white p-3 transition hover:border-[#111315] hover:shadow-[7px_7px_0_#ffcf33] sm:grid-cols-[180px_minmax(0,1fr)]"
                                                    style={{ animationDelay: `${index * 55}ms` }}
                                                >
                                                    <img
                                                        src={getCoverImage(post, index + 3)}
                                                        alt={post.title}
                                                        loading="lazy"
                                                        className="h-44 w-full rounded-[1.1rem] object-cover sm:h-full"
                                                    />
                                                    <div className="flex min-w-0 flex-col justify-between p-2">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
                                                                <span>{getCategory(post)}</span>
                                                                <span>{formatDate(post.createdAt)}</span>
                                                            </div>
                                                            <h3 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-[#111315] group-hover:underline">
                                                                {post.title}
                                                            </h3>
                                                            <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-zinc-500">
                                                                {getExcerpt(post)}
                                                            </p>
                                                        </div>
                                                        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                                                            <span>{post.author || "Unknown author"}</span>
                                                            <span>{getReadTime(post)}</span>
                                                            <span>{getLikeCount(post)} likes</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        <aside className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm lg:self-start">
                                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-400">Fresh drops</p>
                                                    <h2 className="feed-display text-4xl leading-none text-[#111315]">Latest</h2>
                                                </div>
                                                <span className="rounded-full bg-[#1ccad8] px-3 py-1 text-xs font-black text-[#111315]">New</span>
                                            </div>

                                            <div className="mt-4 space-y-3">
                                                {latestPosts.map((post, index) => (
                                                    <Link
                                                        key={post._id}
                                                        to={`/singleProfile/${post._id}`}
                                                        className="group grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-2xl p-2 transition hover:bg-zinc-50"
                                                    >
                                                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#111315] bg-[#ffcf33] text-sm font-black text-[#111315]">
                                                            {index + 1}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <h3 className="line-clamp-2 text-sm font-black leading-snug text-[#111315] group-hover:underline">
                                                                {post.title}
                                                            </h3>
                                                            <p className="mt-1 text-xs font-semibold text-zinc-400">{post.author || "Unknown author"}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </aside>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Feed;
