import { useState, useEffect } from 'react';

/**
 * Custom hook to manage posts and related state.
 * Provides state and setters for posts, form visibility, text input, errors, and user data.
 */
export const usePostsState = () => {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [text, setText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);
    const [likeError, setLikeError] = useState(''); 
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    return {
        posts, setPosts,
        showForm, setShowForm,
        text, setText,
        errorMessage, setErrorMessage,
        user, setUser,
        likeError, setLikeError,
        showErrorPopup, setShowErrorPopup
    };
};

/**
 * Custom hook to fetch posts and user profile data from the server.
 * Uses useEffect to trigger data fetching when the component mounts.
 */
export const useFetchPostsAndUserProfile = ({ setPosts, setErrorMessage, setUser }) => {
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
                    setErrorMessage(result.message || 'Failed to fetch user profile');
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                setErrorMessage('Failed to fetch user profile');
            }
        };

        fetchPosts();
        fetchUserProfile();
    }, [setPosts, setErrorMessage, setUser]);
};

/**
 * Custom hook to handle form submission for adding a new post.
 * Sends a POST request to add the post and updates the state accordingly.
 */
export const useHandleSubmitPost = ({
    user, text, setPosts, posts, setText, setShowForm, setErrorMessage
}) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!text || !user) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/posts', {
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

    return handleSubmit;
};

/**
 * Custom hook to handle liking a post.
 * Sends a PUT request to like the post and updates the state accordingly.
 */
export const useHandleLikePost = ({ user, setPosts, posts, setLikeError, setShowErrorPopup }) => {
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

    return handleLikePost;
};

/**
 * Custom hook to handle form visibility and resetting form fields.
 * Provides functions to close the form and reset fields, or open the form.
 */
export const useHandleFormVisibility = ({ setShowForm, setText }) => {
    const handleFormClose = () => {
        setShowForm(false);
        setText('');
    };

    const handleAddPostClick = () => {
        setShowForm(true);
    };

    return { handleFormClose, handleAddPostClick };
};

/**
 * Custom hook to handle error popup visibility and reset error states.
 * Provides a function to close the error popup and clear error messages.
 */
export const useHandleErrorPopup = ({ setShowErrorPopup, setLikeError }) => {
    const handleErrorPopupClose = () => {
        setShowErrorPopup(false);
        setLikeError('');
    };

    return handleErrorPopupClose;
};
