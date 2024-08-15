import React from 'react';
import PostForm from './PostForm';
import PostList from './PostList';
import ErrorPopup from './ErrorPopup';
import { usePosts, usePostForm } from './Hooks';

const Posts = () => {
  const {
    posts,
    showForm,
    showErrorPopup,
    likeError,
    handleLikePost,
    handleAddPostClick,
    handleFormClose,
    handleErrorPopupClose,
  } = usePosts();

  const { text, setText, errorMessage, setErrorMessage, resetForm } = usePostForm();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();
      if (response.ok) {
        setPosts([result, ...posts]);
        resetForm();
        setShowForm(false);
        setErrorMessage('');
      } else {
        setErrorMessage(result.message || 'Failed to add post');
      }
    } catch (error) {
      console.error('Failed to add post:', error);
      setErrorMessage('Failed to add post');
    }
  };

  return (
    <section id="posts" className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Posts</h2>

      <div className="text-center mb-8">
        <button
          onClick={handleAddPostClick}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Add New Post
        </button>
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
        <ErrorPopup likeError={likeError} handleErrorPopupClose={handleErrorPopupClose} />
      )}
    </section>
  );
};

export default Posts;
