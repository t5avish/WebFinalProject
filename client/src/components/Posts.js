import React, { useEffect, useState } from 'react';
import { URL } from '../settings';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(URL + 'posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (response.ok) {
          setPosts(result);
        } else {
          setErrorMessage(result.message || 'Error fetching posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setErrorMessage('Error fetching posts');
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('Not authenticated');
        return;
      }

      try {
        const response = await fetch(URL + 'profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (response.ok) {
          setUser(result);
        } else {
          setErrorMessage(result.message || 'Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setErrorMessage('Failed to fetch user profile');
      }
    };

    fetchPosts();
    fetchUserProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text || !user) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(URL + 'posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: user.name,
            profilePicture: user.avatar, // Ensure this field matches what is stored in the DB
          },
          text,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setPosts([result, ...posts]);
        setText('');
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

  const handleFormClose = () => {
    setShowForm(false);
    setText('');
  };

  const handleAddPostClick = () => {
    setShowForm(true);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(URL + 'posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, userId: user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        setPosts(posts.map(post => post._id === postId ? result : post));
      } else {
        setErrorMessage(result.message || 'Failed to like post');
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      setErrorMessage('Failed to like post');
    }
  };

  return (
    <section id="posts" className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Posts</h2>
      <div className="text-center mb-8">
        <button onClick={handleAddPostClick} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500">Add New Post</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center">
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <button 
              onClick={handleFormClose} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              X
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Post</h3>
            {errorMessage && <p className="text-red-500 mb-4 text-center dark:text-red-300">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Text:</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="text-center">
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {posts.map(post => (
        <div key={post._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex">
          <div className="w-1/4 flex flex-col items-center">
            <img src={require(`../assets/${post.user.profilePicture}`)} alt={post.user.name} className="w-10 h-10 rounded-full mb-4" />
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
    </section>
  );
};

export default Posts;
