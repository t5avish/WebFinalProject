import React from 'react';
import { usePostForm, usePosts } from './Hooks';

const PostForm = () => {
  const { text, setText, resetForm } = usePostForm();
  const { setPosts, toggleFormVisibility } = usePosts();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        setPosts((prevPosts) => [result, ...prevPosts]);
        resetForm();
        toggleFormVisibility();
      } else {
        console.error('Failed to add post:', result.message);
      }
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <button
          onClick={toggleFormVisibility}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          X
        </button>
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Post</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Text:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
