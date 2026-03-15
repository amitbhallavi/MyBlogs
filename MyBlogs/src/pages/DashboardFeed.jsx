



// ── Profile Page ──────────────────────────────────────────────────────────────

import React, { useEffect } from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { getBlogs } from '../components/features/blogs/blogSlice';
import LoaderTwo from '../components/LoaderTwo';
import { toast } from 'react-toastify';









const Feed = () => {



    const [activeTab, setActiveTab] = useState("posts");


    const { user } = useSelector((state) => state.auth)

    const { blogs, blogLoading, blogError, blogSuccess, blogErrorMessage } = useSelector((state => state.blog))

    const dispatch = useDispatch();

    useEffect(() => {

        dispatch(getBlogs());
        if (blogError && blogErrorMessage) {

            toast.error(blogErrorMessage)

        }

    }, [dispatch, blogError, blogErrorMessage]);



    if (blogLoading) {
        return (

            <LoaderTwo />

        )

    }

     // Date Formate -> 
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };




    return (



        <div className="max-w-4xl mx-auto px-4 py-8">


            {/* Hero */}

            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Blog</span> Feed
                </h1>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">Stories, ideas, and experiences from our community</p>
            </div>



            {/* Profile Header */}


            {/* Tabs */}

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
                {["posts", "liked", "saved"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Posts Grid */}

            {activeTab === "posts" && (

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {blogs.map((post) => (

                        <Link to={`/singleProfile/${post._id}`} key={post._id}>



                            <article key={post._id} 
                                className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md cursor-pointer transition-all">
                                {post.image && (
                                    <img src={post.image} alt={post.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                                )}

                                <div key={post._id} className="flex-1 min-w-0 border border-gray-200 rounded-lg p-4">

                                    {post.title} {post.categoryColor}
                                    <h3 className="font-bold text-gray-900 text-sm mt-1.5 line-clamp-2 leading-snug">{post.description}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{post._id} · {post.readTime}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                        <span>♥ {post.author}</span>
                                        <span>💬   {formatDate(post.createdAt)}</span>
                                    </div>
                                </div>

                            </article>
                        </Link>


                    ))}


                </div>


            )}

            {activeTab === "liked" && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">♡</p>
                    <p className="font-medium">No liked posts yet</p>
                    <p className="text-sm mt-1">Posts you like will appear here</p>
                </div>
            )}

            {activeTab === "saved" && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">🔖</p>
                    <p className="font-medium">Nothing saved yet</p>
                    <p className="text-sm mt-1">Save posts to read them later</p>
                </div>
            )}
        </div>












    );

}

export default Feed

