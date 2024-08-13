import React from 'react';

const PostList = ({ posts, handleLikePost }) => {
    return (
        <>
            {posts.map(post => (
                <div key={post._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex">
                    <div className="w-1/4 flex flex-col items-center">
                        <img src={require(`../../assets/${post.user.profilePicture}`)} alt={post.user.name} className="w-10 h-10 rounded-full mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{post.user.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{new Date(post.date).toLocaleString()}</p>
                        <button onClick={() => handleLikePost(post._id)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">
                            Like
                        </button>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{post.likes ? post.likes.length : 0} {post.likes && post.likes.length === 1 ? 'person likes' : 'people like'} this post</p>
                    </div>
                    <div className="w-3/4 text-center flex items-center justify-center">
                        <p className="mb-4 text-gray-800 dark:text-gray-300">{post.text}</p>
                    </div>
                </div>
            ))}
        </>
    );
};

export default PostList;
