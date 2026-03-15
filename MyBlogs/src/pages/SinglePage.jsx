// ── Profile Page ──────────────────────────────────────────────────────────────

import React, { useEffect } from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBlog, getBlogs, removeBlog } from '../components/features/blogs/blogSlice';
import LoaderTwo from '../components/LoaderTwo';
import { toast } from 'react-toastify';



const SingleProfile = () => {


    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth)

    const { blog, blogLoading, blogError, blogSuccess, blogErrorMessage } = useSelector((state => state.blog))


    const { id } = useParams();
    const dispatch = useDispatch();

    const handleRemoveBlog = (id) => {

        dispatch(removeBlog(id))
        navigate("/")


    }





    useEffect(() => {

        dispatch(getBlog(id));

        if (blogError && blogErrorMessage) {

            toast.error(blogErrorMessage)

        }

    }, [dispatch, blogError, blogErrorMessage]);


    if (blogLoading) {
        return (
            <LoaderTwo />

        )

    }



    return (


        <div className="max-w-4xl mx-auto   px-4 py-8">


            {/* Profile Header */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6  text-white mb-6">


                <div className="flex flex-col  items-center  gap-5">



                    <div className=" h-auto w-auto flex gap-1 mt-5 justify-center sm:justify-start   ">

                        <div>
                            <h1 className="text-2xl font-black"> {blog?.title || " Unknown User "} </h1>
                            <p className="text-indigo-100 mt-2 text-sm max-w-sm"> {blog?.description || "No description available"}. 🌍</p>
                            <p className="text-indigo-200 text-sm mt-1"> {blog?.author || "Unknown Author "}  </p>
                            <p className="text-indigo-200 text-sm mt-1"> {new Date(blog?.createdAt || Date.now()).toLocaleDateString('en-IN')} · Joined  </p>

                        </div>

                        {!user ? (

                            <div className='  p-20 '>

                                <button className="bg-white mr-3 text-indigo-600 cursor-pointer font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors ">
                                    Edit Profile
                                </button>

                                <button className="bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-500 transition-colors cursor-pointer ">
                                    Delete Profile
                                </button>
                                <p className=' px-5 bg-red-600 mt-5'> You Not Authorized Person to Edit or Delete  ! </p>
                            </div>) :
                            <div className='  p-20 '>

                                <button onClick={() => setShowModal(!showModal)} className="bg-white mr-3 text-indigo-600 cursor-pointer font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors ">
                                    Edit Profile
                                </button>

                                <button onClick={() => handleRemoveBlog(id)} className="bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-red-500 transition-colors cursor-pointer ">
                                    Delete Profile
                                </button>
                            </div>}

                    </div>


                    {
                        showModal && (
                            <div className="max-w-4xl mx-auto px-4 py-8 ">


                                {/* Profile Header */}
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6  text-white ">






                                    {/* FORM DATA -> */}


                                    <div className="  flex flex items-center py-5 px-10  bg-white rounded-md   border-t border-indigo-400">

                                        <div className="  space-y-4">
                                            {/* Title */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5"> Title </label>
                                                <input
                                                    placeholder={blog?.title || "Unknown User "}
                                                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                                                />
                                            </div>

                                            {/* description */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5"> Description </label>
                                                <input
                                                    type="description"
                                                    placeholder={blog?.description || "No description available"}
                                                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                                                />
                                            </div>

                                            {/* Author */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5"> Author </label>
                                                <div className="relative">
                                                    <input
                                                        placeholder={blog?.author || "Unknown Author "}
                                                        className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                                                    />
                                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                                                    </button>
                                                </div>

                                            </div>

                                            {/* createdAt */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Created At</label>
                                                <input
                                                    type=" date "
                                                    placeholder={new Date(blog?.createdAt || Date.now()).toLocaleDateString('en-IN')}
                                                    className={`w-full border rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-50 transition `}
                                                />
                                            </div>

                                            {/* Terms */}
                                            <div>

                                            </div>
                                            <div className="flex flex-col items-center mb-10">


                                                <button onClick={() => setShowModal(!showModal)} className=" px-25  mt-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center  cursor-pointer"
                                                >
                                                    Updating…
                                                </button>



                                            </div>


                                        </div>






                                    </div>





                                </div>






                            </div>

                        )

                    }

                </div>
            </div>
        </div>
    );
}

export default SingleProfile

