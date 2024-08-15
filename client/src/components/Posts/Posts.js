import React from 'react';
import PostForm from './PostForm';
import PostList from './PostList';
import ErrorPopup from './ErrorPopup';
import { usePosts } from './Hooks';

const Posts = () => {
  const {
    posts,
    error,
    likeError,
    showForm,
    showErrorPopup,
    handleLikePost,
    toggleFormVisibility,
    closeErrorPopup,
  } = usePosts();

  return (
    <section className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Posts</h2>

      <div className="text-center mb-8">
        <button
          onClick={toggleFormVisibility}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Add New Post
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4 dark:text-red-300">
          {error}
        </div>
      )}

      {showForm && <PostForm />}

      <PostList posts={posts} onLike={handleLikePost} />

      {showErrorPopup && (
        <ErrorPopup
          message={likeError}
          onClose={closeErrorPopup}
        />
      )}
    </section>
  );
};

export default Posts;
