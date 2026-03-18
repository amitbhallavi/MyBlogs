import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBlog, removeBlog } from '../components/features/blogs/blogSlice';
import LoaderTwo from '../components/LoaderTwo';
import { toast } from 'react-toastify';

const SingleProfile = () => {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { blog, blogLoading, blogError, blogErrorMessage } = useSelector((state) => state.blog);

    const { id } = useParams();
    const dispatch = useDispatch();

    const handleRemoveBlog = (id) => {
        dispatch(removeBlog(id));
        navigate("/");
    };

    useEffect(() => {
        dispatch(getBlog(id));
        if (blogError && blogErrorMessage) {
            toast.error(blogErrorMessage);
        }
    }, [dispatch, blogError, blogErrorMessage]);

    if (blogLoading) return <LoaderTwo />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">

            {/* Profile Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">

                <div className="flex flex-col gap-5">

                    {/* Blog Info */}
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-black">{blog?.title || "Unknown Title"}</h1>
                            <p className="text-indigo-100 mt-2 text-sm max-w-sm">{blog?.description || "No description available"} 🌍</p>
                            <p className="text-indigo-200 text-sm mt-1">{blog?.author || "Unknown Author"}</p>
                            <p className="text-indigo-200 text-sm mt-1">
                                {new Date(blog?.createdAt || Date.now()).toLocaleDateString('en-IN')} · Published
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row sm:flex-col gap-3 mt-2 sm:mt-0">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setShowModal(!showModal)}
                                        className="bg-white text-indigo-600 cursor-pointer font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
                                    >
                                        Edit Blog
                                    </button>
                                    <button
                                        onClick={() => handleRemoveBlog(id)}
                                        className="bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-500 transition-colors cursor-pointer"
                                    >
                                        Delete Blog
                                    </button>
                                </>
                            ) : (
                                <p className="bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
                                    ⚠️ You are not authorized to Edit or Delete!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Edit Modal — inline, no nested div mess */}
                    {showModal && (
                        <div className="bg-white rounded-2xl p-6 mt-2">
                            <h2 className="text-gray-800 font-black text-lg mb-5">Edit Blog</h2>

                            <div className="space-y-4">

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                    <input
                                        placeholder={blog?.title || "Unknown Title"}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder={blog?.description || "No description available"}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
                                    />
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author</label>
                                    <input
                                        placeholder={blog?.author || "Unknown Author"}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Created At</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-300 transition"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer">
                                        Update Blog
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SingleProfile;