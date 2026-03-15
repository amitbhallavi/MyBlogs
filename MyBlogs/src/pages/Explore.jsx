import React, { useEffect, useState } from "react";
import BlogCard from "../components/UserProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../components/features/blogs/blogSlice";
import LoaderTwo from "../components/LoaderTwo";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";








const ExplorePage = ({  setSelectedPost  }) => {



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
    // Format date for display

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


        <div className="max-w-6xl mx-auto px-4 py-8">



            {/* All Blogs Display Section */}

            <div className="mt-12">
                <h2 className="text-3xl font-black text-gray-800 mb-6">📰 All Blogs </h2>

                {blogLoading && blogs.length === 0 ? (
                    <div className="flex justify-center items-center py-12">
                        <LoaderTwo />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                        <p className="text-yellow-800 text-lg">📝 No blog posts yet. Be the first to share!</p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {blogs.map((blog, index) => (
                            <Link to={`/singleProfile/${blog._id}`} key={blog._id}>

                                <div key={blog._id || index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden hover:border-indigo-300">
                                    <div className="p-6">
                                        {/* Blog Title */}
                                        <h3 className="text-2xl font-bold text-indigo-600 mb-2 line-clamp-2">
                                            {blog.title}
                                        </h3>

                                        {/* Author and Date */}
                                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                                            <span className="font-semibold text-gray-700">👤 {blog.author}</span>
                                            <span className="text-gray-500"> 📅 {formatDate(blog.createdAt)}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">
                                            {blog.description}
                                        </p>

                                        {/* Read More Button */}
                                        <button
                                            onClick={() => setSelectedPost(blog)}
                                            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            Read Full Post →
                                        </button>
                                    </div>
                                </div>
                            </Link>


                        ))}

                    </div>
                )}
            </div>






        </div>
    );





    // return (
    //     <div>
    //         <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Dashboard</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    //             {["Total Glogs", "Views", "Likes", "Comments"].map((item, idx) => (
    //                 <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 text-center">
    //                     <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{item}</h3>
    //                     <p className="text-2xl font-bold text-indigo-600">123</p>
    //                 </div>
    //             ))}
    //         </div>
    //         <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Recent Blogs</h3>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             {mockBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
    //         </div>
    //     </div>
    // );
}


export default ExplorePage;
