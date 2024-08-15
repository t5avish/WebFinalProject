import React from 'react';

const PostList = ({ posts, onLike }) => {
  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {post.user.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(post.date).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onLike(post._id)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Like
            </button>
          </div>
          <p className="text-gray-800 dark:text-gray-300">{post.text}</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
