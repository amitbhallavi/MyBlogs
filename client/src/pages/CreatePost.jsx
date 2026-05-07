// ── Create Blog Post Page ──────────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, getBlogs } from '../components/features/blogs/blogSlice';

const CreatePost = () => {

    const dispatch = useDispatch();
    const { blogLoading, blogError, blogErrorMessage } = useSelector((state) => state.blog);
    const { user } = useSelector((state) => state.auth)
    // Form state for creating blog

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        description: '',
    });
    const { title, description } = formData

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);



    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission to create blog
    const handleCreateBlog = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            alert('Please fill in all fields');
            return;
        }

        // Prepare blog data with user information
        const blogData = {
            title,
            content: description,
            description,
            author: user?.name || user?.username || 'Anonymous',
            authorId: user?._id,  // Include user ID for proper tracking
            userId: user?._id,    // Backend compatibility
        };

        // Dispatch createBlog action
        const result = await dispatch(createBlog(blogData));

        if (result.payload) {
            setShowSuccess(true);
            // Reset form after successful submission
            setFormData({
                title: '',
                content: '',
                description: '',
            });
            // Re-fetch all blogs to show new blog in profile
            setTimeout(() => {
                dispatch(getBlogs());
                setShowSuccess(false);
            }, 1500);
        } else {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        }
    };



    return (

        <div className="max-w-4xl mx-auto px-4 py-8">



            {/* Success Message */}
            {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                    ✅ Blog post created successfully!
                </div>
            )}

            {/* Error Message */}
            {(showError || blogError) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                    ❌ Error: {blogErrorMessage || 'Failed to create blog post'}
                </div>
            )}


            {!user ? (

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6">
                    <h1 className="text-3xl font-black mb-2">✍️ Create a Account , You Need to be Logged In</h1>
                    <p className="text-indigo-200"> login required! </p>
                </div>

            ) : (
                <>

                    {/* Page Header */}

                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6">
                        <h1 className="text-3xl font-black mb-2">✍️ Create a New Blog Post</h1>
                        <p className="text-indigo-200">Share your thoughts and ideas with the world - No login required!</p>
                    </div>
                    {/* Blog Creation Form */}

                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                        <form onSubmit={handleCreateBlog}>
                            {/* Blog Title */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Blog Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={handleInputChange}
                                    placeholder="Enter an engaging title for your blog..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            {/* Author Info - Auto-filled */}
                            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    👤 Author
                                </label>
                                <p className="text-sm text-gray-800 font-semibold">{user?.name || user?.username || 'Anonymous'}</p>
                                <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
                            </div>

                            {/* Blog Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Blog Content *
                                </label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={handleInputChange}
                                    placeholder="Write your blog content here... Be creative!"
                                    rows="10"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={blogLoading}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                                >

                                    🚀 Publish Blog Post

                                </button>

                                <button
                                    type="reset"
                                    className="px-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3.5 rounded-xl transition-colors cursor-pointer"
                                    onClick={() => setFormData({ title: '', content: '', description: '' })}
                                >
                                    Clear
                                </button>
                            </div>

                        </form>
                    </div>







                </>
            )



            }




            {/* Info Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">📝 Tips for a Great Blog Post:</h3>
                <ul className="text-blue-800 space-y-2">
                    <li>✓ Use a clear, descriptive title</li>
                    <li>✓ Write engaging content that captures attention</li>
                    <li>✓ Use your real name or a memorable pseudonym</li>
                    <li>✓ Share your authentic thoughts and experiences</li>
                    <li>✓ No login required - Everyone can publish!</li>
                </ul>
            </div>










        </div>
    );

}

export default CreatePost
