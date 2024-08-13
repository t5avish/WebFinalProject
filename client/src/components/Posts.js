import React, { useEffect, useState } from 'react';
import { URL } from '../settings';
import PostForm from './PostForm';
import PostList from './PostList';
import ErrorPopup from './ErrorPopup';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null);
  const [likeError, setLikeError] = useState(''); 
  const [showErrorPopup, setShowErrorPopup] = useState(false);

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
            profilePicture: user.avatar,
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
        setLikeError(''); 
      } else {
        setLikeError(result.message || 'Failed to like post');
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      setLikeError('Failed to like post');
      setShowErrorPopup(true);
    }
  };

  const handleErrorPopupClose = () => {
    setShowErrorPopup(false);
    setLikeError('');
  };

  return (
    <section id="posts" className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Posts</h2>

      <div className="text-center mb-8">
        <button onClick={handleAddPostClick} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500">Add New Post</button>
      </div>

      {/* Conditionally render the PostForm component */}
      {showForm && (
        <PostForm 
          text={text}
          setText={setText}
          errorMessage={errorMessage}
          handleSubmit={handleSubmit}
          handleFormClose={handleFormClose}
        />
      )}

      {/* Render the PostList component */}
      <PostList posts={posts} handleLikePost={handleLikePost} />

      {/* Conditionally render the ErrorPopup component */}
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
