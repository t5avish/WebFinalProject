import { useState, useEffect } from 'react';

/**
 * Custom hook to manage challenge data and form state.
 * Provides state and setters for challenges, form visibility, and form fields.
 */
export const useChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [numDays, setNumDays] = useState('');
    const [measurement, setMeasurement] = useState('seconds');
    const [goal, setGoal] = useState('');
    const [description, setDescription] = useState('');

    return {
        challenges, setChallenges,
        showForm, setShowForm,
        title, setTitle,
        numDays, setNumDays,
        measurement, setMeasurement,
        goal, setGoal,
        description, setDescription
    };
};

/**
 * Custom hook to fetch challenges from the server.
 * Uses useEffect to trigger the fetch when the component mounts.
 */
export const useFetchChallenges = ({ setChallenges }) => {
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await fetch('/api/challenges', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setChallenges(data);
            } catch (error) {
                console.error('Failed to fetch challenges:', error);
            }
        };

        fetchChallenges();
    }, [setChallenges]);
};

/**
 * Custom hook to handle form submission for adding a new challenge.
 * Sends a POST request to add the challenge and updates the state accordingly.
 */
export const useHandleSubmitChallenge = ({
    challenges, setChallenges, title, setTitle,
    numDays, setNumDays, measurement, setMeasurement,
    goal, setGoal, description, setDescription, setShowForm
}) => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!title || !description || !numDays || !goal) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, numDays, measurement, goal }),
            });
            if (response.ok) {
                const newChallenge = await response.json();
                setChallenges([...challenges, newChallenge]);
                setTitle('');
                setNumDays('');
                setMeasurement('seconds');
                setGoal('');
                setDescription('');
                setShowForm(false);
            } else {
                alert('Failed to add challenge');
            }
        } catch (error) {
            console.error('Failed to add challenge:', error);
        }
    };

    return handleSubmit;
};

/**
 * Custom hook to handle joining a challenge.
 * Sends a PUT request to join the challenge.
 */
export const useHandleJoinChallenge = () => {
    const handleJoinChallenge = async (challengeId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Not authenticated');
                return;
            }

            const response = await fetch('/api/challenges', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ challengeId, overwrite: true }),
            });
            if (response.ok) {
                alert('Successfully joined the challenge');
            } else {
                alert('Failed to join the challenge');
            }
        } catch (error) {
            console.error('Failed to join challenge:', error);
        }
    };

    return handleJoinChallenge;
};

/**
 * Custom hook to handle form visibility and resetting form fields.
 * Provides functions to close the form and reset fields, or open the form.
 */
export const useHandleFormVisibility = ({ setShowForm, setTitle, setNumDays, setMeasurement, setGoal, setDescription }) => {
    const handleFormClose = () => {
        setShowForm(false);
        setTitle('');
        setNumDays('');
        setMeasurement('seconds');
        setGoal('');
        setDescription('');
    };

    const handleAddChallengeClick = () => {
        setShowForm(true);
    };

    return { handleFormClose, handleAddChallengeClick };
};
