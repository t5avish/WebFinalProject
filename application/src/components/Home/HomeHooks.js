import { useState } from 'react';

/**
 * Custom hook to manage login form state and submission.
 * Handles input fields for email and password, and manages form submission.
 */
export const useLoginForm = ({ onLogin, closeModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Handles the submission of the login form.
     * Sends login credentials to the server and processes the response.
     * If login is successful, stores the token, triggers the onLogin callback, and closes the modal.
     * If login fails, sets an error message.
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
                localStorage.setItem('token', data.token);
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

/**
 * Custom hook to manage sign-up form state and submission.
 * Handles input fields for user details, and manages form submission.
 */
export const useSignUpForm = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
        weight: '',
        height: '',
        gender: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);

    /**
     * Handles changes to input fields in the sign-up form.
     * Updates the corresponding state for each input field.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    /**
     * Handles the submission of the sign-up form.
     * Sends user data to the server and processes the response.
     * If sign-up is successful, displays a success message.
     * If sign-up fails, sets an error message.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                setSuccessMessage(true);
                setErrorMessage('');
            } else {
                setErrorMessage(result.message || 'An error occurred. Please try again later.');
                setSuccessMessage(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again later.');
            setSuccessMessage(false);
        }
    };

    return {
        formData, handleChange,
        errorMessage, successMessage,
        handleSubmit
    };
};
