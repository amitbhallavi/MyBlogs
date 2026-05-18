import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    addBlogComment,
    deleteBlogComment,
    getBlog,
    removeBlog,
    toggleBlogLike,
    updateBlog,
} from "../components/features/blogs/blogSlice";
import LoaderTwo from "../components/LoaderTwo";

const getLikeCount = (blog) => Number(blog?.likes) || 0;
const getCommentCount = (blog) => Array.isArray(blog?.comments) ? blog.comments.length : Number(blog?.comments) || 0;

const getReadTime = (blog) => {
    if (blog?.readTime) return blog.readTime;

    const text = `${blog?.title || ""} ${blog?.description || ""} ${blog?.content || ""}`;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
};

const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const SingleProfile = () => {
    const [showModal, setShowModal] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        image: "",
        category: "",
        tags: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { blog, blogLoading, blogError, blogErrorMessage } = useSelector((state) => state.blog);

    const blogAuthorId = blog?.author?._id || blog?.authorId || blog?.userId;
    const canManageBlog = Boolean(user && blogAuthorId && blogAuthorId === user._id);
    const likedBy = Array.isArray(blog?.likedBy) ? blog.likedBy : [];
    const isLiked = Boolean(user?._id && likedBy.includes(user._id));
    const articleBody = blog?.content || blog?.description || "";
    const comments = Array.isArray(blog?.comments) ? blog.comments : [];

    useEffect(() => {
        dispatch(getBlog(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (blogError && blogErrorMessage) {
            toast.error(blogErrorMessage);
        }
    }, [blogError, blogErrorMessage]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleEditModal = () => {
        if (showModal) {
            setShowModal(false);
            return;
        }

        setEditForm({
            title: blog?.title || "",
            description: blog?.description || blog?.content || "",
            image: blog?.image || "",
            category: blog?.category || "",
            tags: Array.isArray(blog?.tags) ? blog.tags.join(", ") : "",
        });
        setShowModal(true);
    };

    const handleRemoveBlog = async () => {
        try {
            await dispatch(removeBlog(id)).unwrap();
            toast.success("Post deleted");
            navigate("/");
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to delete post");
        }
    };

    const handleUpdateBlog = async () => {
        if (!editForm.title.trim() || !editForm.description.trim()) {
            toast.error("Title and content are required");
            return;
        }

        try {
            await dispatch(updateBlog({
                blogId: id,
                formData: {
                    title: editForm.title.trim(),
                    description: editForm.description.trim(),
                    content: editForm.description.trim(),
                    image: editForm.image.trim(),
                    category: editForm.category.trim(),
                    tags: editForm.tags,
                },
            })).unwrap();
            toast.success("Post updated");
            setShowModal(false);
            dispatch(getBlog(id));
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to update post");
        }
    };

    const handleToggleLike = async () => {
        if (!user) {
            toast.error("Login required to like posts");
            return;
        }

        try {
            await dispatch(toggleBlogLike(id)).unwrap();
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to update like");
        }
    };

    const handleAddComment = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error("Login required to comment");
            return;
        }

        if (!commentText.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            await dispatch(addBlogComment({ blogId: id, text: commentText.trim() })).unwrap();
            setCommentText("");
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to add comment");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await dispatch(deleteBlogComment({ blogId: id, commentId })).unwrap();
        } catch (error) {
            toast.error(typeof error === "string" ? error : "Failed to delete comment");
        }
    };

    if (blogLoading && !blog?._id) return <LoaderTwo />;

    return (
        <main className="min-h-screen bg-[#f7f3ea] text-[#111315]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');
                .article-shell{font-family:'Archivo',sans-serif}
                .article-display{font-family:'Fraunces',serif}
                .article-grid{background-image:linear-gradient(rgba(17,19,21,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(17,19,21,.06) 1px,transparent 1px);background-size:34px 34px}
            `}</style>

            <section className="article-shell article-grid px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <Link to="/explore" className="mb-5 inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-500 transition hover:border-[#111315] hover:text-[#111315]">
                        Back to explore
                    </Link>

                    {blogError && (
                        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
                            <p className="font-black">Post could not load.</p>
                            <p className="mt-1 text-sm">{blogErrorMessage || "Check the backend and try again."}</p>
                        </div>
                    )}

                    {!blogError && (
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <article className="overflow-hidden rounded-[2rem] border border-[#111315] bg-white shadow-[9px_9px_0_#f6cf4f]">
                                <div className="relative min-h-[420px] bg-[#111315]">
                                    {blog?.image ? (
                                        <img src={blog.image} alt={blog.title} className="absolute inset-0 h-full w-full object-cover opacity-85" />
                                    ) : (
                                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#263bff,#111315_58%,#f45d48)]" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111315] via-[#111315]/45 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                                        <div className="mb-4 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-[#f6cf4f] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#111315]">
                                                {blog?.category || "Story"}
                                            </span>
                                            <span className="rounded-full border border-white/30 px-3 py-1 text-xs font-bold text-white/85">
                                                {getReadTime(blog)}
                                            </span>
                                        </div>
                                        <h1 className="article-display max-w-4xl text-5xl leading-[0.9] tracking-normal sm:text-7xl">
                                            {blog?.title || "Untitled post"}
                                        </h1>
                                        <div className="mt-5 flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.16em] text-white/70">
                                            <span>{blog?.author || "Unknown author"}</span>
                                            <span>{formatDate(blog?.createdAt)}</span>
                                            <span>{getLikeCount(blog)} likes</span>
                                            <span>{getCommentCount(blog)} comments</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 sm:p-8">
                                    <div className="prose max-w-none">
                                        {articleBody.split("\n").filter(Boolean).map((paragraph, index) => (
                                            <p key={`${paragraph.slice(0, 24)}-${index}`} className="mb-5 text-lg font-medium leading-8 text-zinc-700">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </article>

                            <aside className="space-y-5">
                                <div className="rounded-[2rem] border border-[#111315] bg-[#111315] p-5 text-white shadow-[7px_7px_0_#1ccad8]">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f6cf4f]">Actions</p>
                                    <button type="button" onClick={handleToggleLike} className={`mt-5 w-full rounded-full py-3 text-sm font-black uppercase tracking-[0.16em] transition ${isLiked ? "bg-[#f45d48] text-white" : "bg-white text-[#111315] hover:bg-[#f6cf4f]"}`}>
                                        {isLiked ? "Liked" : "Like post"}
                                    </button>

                                    {canManageBlog ? (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <button type="button" onClick={handleToggleEditModal} className="rounded-full border border-white/15 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#111315]">
                                                Edit
                                            </button>
                                            <button type="button" onClick={handleRemoveBlog} className="rounded-full bg-[#f45d48] py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-[#111315]">
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-sm font-semibold leading-6 text-white/58">
                                            Only the author can edit or delete this post.
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#263bff]">Discussion</p>
                                    <h2 className="article-display mt-2 text-4xl leading-none">Comments</h2>

                                    <form onSubmit={handleAddComment} className="mt-5">
                                        <textarea
                                            value={commentText}
                                            onChange={(event) => setCommentText(event.target.value)}
                                            placeholder={user ? "Write a clear comment..." : "Login to comment"}
                                            rows={4}
                                            disabled={!user}
                                            className="w-full resize-none rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[#111315] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                        />
                                        <button type="submit" disabled={!user} className="mt-3 w-full rounded-full bg-[#111315] py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff] disabled:cursor-not-allowed disabled:opacity-60">
                                            Add comment
                                        </button>
                                    </form>

                                    <div className="mt-5 space-y-3">
                                        {comments.length === 0 ? (
                                            <p className="rounded-2xl bg-[#fbfaf5] p-4 text-sm font-semibold text-zinc-500">No comments yet.</p>
                                        ) : (
                                            comments.map((comment) => {
                                                const canDeleteComment = Boolean(user && (canManageBlog || comment.user === user._id));

                                                return (
                                                    <div key={comment._id} className="rounded-2xl border border-zinc-100 bg-[#fbfaf5] p-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-black text-[#111315]">{comment.name || "Reader"}</p>
                                                                <p className="mt-1 text-xs font-semibold text-zinc-400">{formatDate(comment.createdAt)}</p>
                                                            </div>
                                                            {canDeleteComment && (
                                                                <button type="button" onClick={() => handleDeleteComment(comment._id)} className="text-xs font-black uppercase tracking-[0.14em] text-[#f45d48]">
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="mt-3 text-sm font-medium leading-6 text-zinc-600">{comment.text}</p>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-0 backdrop-blur-sm sm:items-center sm:p-4">
                    <div className="w-full overflow-hidden rounded-t-[2rem] border border-zinc-200 bg-white shadow-2xl sm:max-w-2xl sm:rounded-[2rem]">
                        <div className="flex items-center justify-between border-b border-zinc-100 bg-[#fbfaf5] px-5 py-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#263bff]">Post editor</p>
                                <h2 className="article-display text-3xl leading-none">Edit post</h2>
                            </div>
                            <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:border-[#111315]">
                                Close
                            </button>
                        </div>

                        <div className="max-h-[68vh] space-y-4 overflow-y-auto px-5 py-5">
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Title</label>
                                <input name="title" value={editForm.title} onChange={handleInputChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Category</label>
                                    <input name="category" value={editForm.category} onChange={handleInputChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Tags</label>
                                    <input name="tags" value={editForm.tags} onChange={handleInputChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Image URL</label>
                                <input name="image" value={editForm.image} onChange={handleInputChange} className="w-full rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-bold outline-none transition focus:border-[#111315] focus:bg-white" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Content</label>
                                <textarea name="description" value={editForm.description} onChange={handleInputChange} rows={8} className="w-full resize-none rounded-2xl border border-zinc-200 bg-[#fbfaf5] px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-[#111315] focus:bg-white" />
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-zinc-100 px-5 py-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-zinc-300 py-3 text-xs font-black uppercase tracking-[0.16em] transition hover:border-[#111315]">
                                Cancel
                            </button>
                            <button type="button" onClick={handleUpdateBlog} className="flex-1 rounded-full bg-[#111315] py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#263bff]">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default SingleProfile;
