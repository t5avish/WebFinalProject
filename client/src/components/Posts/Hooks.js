import { useState, useEffect } from 'react';

// Custom hook for handling post form state
export const usePostForm = () => {
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const resetForm = () => {
    setText('');
    setErrorMessage('');
  };

  return {
    text,
    setText,
    errorMessage,
    setErrorMessage,
    resetForm,
  };
};

// Custom hook for managing posts
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [likeError, setLikeError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (response.ok) {
          setPosts(result);
        } else {
          throw new Error(result.message || 'Error fetching posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      try {
        const response = await fetch('/api/profile', {
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
          throw new Error(result.message || 'Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchPosts();
    fetchUserProfile();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, userId: user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        setPosts(posts.map((post) => (post._id === postId ? result : post)));
        setLikeError('');
      } else {
        throw new Error(result.message || 'Failed to like post');
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      setLikeError('Failed to like post');
      setShowErrorPopup(true);
    }
  };

  const handleAddPostClick = () => setShowForm(true);
  const handleFormClose = () => setShowForm(false);
  const handleErrorPopupClose = () => setShowErrorPopup(false);

  return {
    posts,
    user,
    likeError,
    showErrorPopup,
    showForm,
    setShowForm,
    handleLikePost,
    handleAddPostClick,
    handleFormClose,
    handleErrorPopupClose,
  };
};
