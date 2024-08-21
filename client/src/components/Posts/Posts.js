import React from 'react';
import {
    usePostsState,
    useFetchPostsAndUserProfile,
    useHandleSubmitPost,
    useHandleLikePost,
    useHandleFormVisibility,
    useHandleErrorPopup
} from './PostsHooks';
import PostForm from './PostForm';
import PostList from './PostList';
import ErrorPopup from './ErrorPopup';

const Posts = () => {
    const {
        posts, setPosts,
        showForm, setShowForm,
        text, setText,
        errorMessage, setErrorMessage,
        user, setUser,
        likeError, setLikeError,
        showErrorPopup, setShowErrorPopup
    } = usePostsState();

    useFetchPostsAndUserProfile({ setPosts, setErrorMessage, setUser });

    const handleSubmit = useHandleSubmitPost({
        user, text, setPosts, posts, setText, setShowForm, setErrorMessage
    });

    const handleLikePost = useHandleLikePost({
        user, setPosts, posts, setLikeError, setShowErrorPopup
    });

    const { handleFormClose, handleAddPostClick } = useHandleFormVisibility({ setShowForm, setText });

    const handleErrorPopupClose = useHandleErrorPopup({ setShowErrorPopup, setLikeError });

    return (
        <section id="posts" className="container mx-auto mt-8 p-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Posts</h2>

            <div className="text-center mb-8">
                <button onClick={handleAddPostClick} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500">Add New Post</button>
            </div>

            {showForm && (
                <PostForm 
                    text={text}
                    setText={setText}
                    errorMessage={errorMessage}
                    handleSubmit={handleSubmit}
                    handleFormClose={handleFormClose}
                />
            )}

            <PostList posts={posts} handleLikePost={handleLikePost} />

            {showErrorPopup && (
                <ErrorPopup 
                    likeError={likeError}
                    handleErrorPopupClose={handleErrorPopupClose}
                />
            )}
        </section>
    );
};

export default Posts;
