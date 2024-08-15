import { useState, useEffect } from 'react';

// Custom hook for managing posts and user data
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [likeError, setLikeError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    // Fetch posts when component mounts
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
          setError(result.message || 'Error fetching posts');
        }
      } catch (error) {
        setError('Error fetching posts');
        console.error('Error fetching posts:', error);
      }
    };

    // Fetch user data when component mounts
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
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
          setError(result.message || 'Failed to fetch user profile');
        }
      } catch (error) {
        setError('Failed to fetch user profile');
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchPosts();
    fetchUser();
  }, []);

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();
      if (response.ok) {
        setPosts(posts.map((post) => (post._id === postId ? result : post)));
      } else {
        setLikeError(result.message || 'Failed to like post');
        setShowErrorPopup(true);
      }
    } catch (error) {
      setLikeError('Failed to like post');
      setShowErrorPopup(true);
      console.error('Failed to like post:', error);
    }
  };

  const toggleFormVisibility = () => setShowForm(!showForm);
  const closeErrorPopup = () => setShowErrorPopup(false);

  return {
    posts,
    user,
    error,
    likeError,
    showForm,
    showErrorPopup,
    setPosts,
    setError,
    handleLikePost,
    toggleFormVisibility,
    closeErrorPopup,
  };
};

// Custom hook for handling the post form state
export const usePostForm = () => {
  const [text, setText] = useState('');

  const resetForm = () => setText('');

  return {
    text,
    setText,
    resetForm,
  };
};
