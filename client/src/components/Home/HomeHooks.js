import { useState } from 'react';

/**
 * Custom hook to manage login form state and submission.
 * Handles form inputs for email and password, and manages error states.
 */
export const useLoginForm = ({ onLogin, closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Submits the login form by sending the credentials to the server.
     * On successful login, stores the token, triggers the onLogin callback, and closes the modal.
     * If login fails, updates the error state with the received error message.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Store token on successful login
                onLogin();
                closeModal();
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Something went wrong');
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        error, handleSubmit
    };
};
