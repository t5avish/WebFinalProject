import { useState, useEffect } from 'react';

/**
 * Custom hook to manage profile data and related state.
 * Provides state and setters for user profile, avatar selection, editing mode, and other profile-related fields.
 */
export const useUserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    return {
        user, setUser,
        loading, setLoading,
        error, setError,
        selectedAvatar, setSelectedAvatar,
        isAvatarSelectorOpen, setIsAvatarSelectorOpen,
        editing, setEditing,
        age, setAge,
        weight, setWeight,
        height, setHeight
    };
};

/**
 * Custom hook to fetch user profile data from the server.
 * Uses useEffect to trigger the fetch when the component mounts.
 */
export const useFetchUser = ({
    setUser, setLoading, setError, setSelectedAvatar, setAge, setWeight, setHeight
}) => {
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data);
                setSelectedAvatar(data.avatar);
                setAge(data.age);
                setWeight(data.weight);
                setHeight(data.height);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [setUser, setLoading, setError, setSelectedAvatar, setAge, setWeight, setHeight]);
};

/**
 * Custom hook for avatar selection.
 * Sends the selected avatar to the server and updates the avatar in the user profile.
 */
export const useHandleAvatarSelect = ({ setSelectedAvatar, setIsAvatarSelectorOpen, setError }) => {
    const handleAvatarSelect = async (avatar) => {
        setSelectedAvatar(avatar);
        setIsAvatarSelectorOpen(false);

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Not authenticated');
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ avatar }),
            });

            if (!response.ok) {
                throw new Error('Failed to update avatar');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return handleAvatarSelect;
};

/**
 * Custom hook to manage challenges in the user profile.
 * Handles viewing challenge details, saving progress, and interacting with challenge-related data.
 */
export const useHandleChallenge = ({ user, setError }) => {
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challengeDetails, setChallengeDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateValue, setSelectedDateValue] = useState('');
    const [isNumberInputOpen, setIsNumberInputOpen] = useState(false);

    /**
     * Fetches and displays the details of a selected challenge.
     */
    const handleViewChallenge = async (challenge) => {
        setSelectedChallenge(challenge);

        try {
            const response = await fetch('/api/get-challenge-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    challengeId: challenge._id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch challenge details');
            }

            const data = await response.json();
            setChallengeDetails(data);
            setSelectedDate(null);
            setSelectedDateValue('');
        } catch (error) {
            setError(error.message);
        }
    };

    /**
     * Saves the user's progress on the selected challenge for a specific date.
     */
    const handleSave = async () => {
        if (selectedDateValue === '' || isNaN(selectedDateValue) || Number(selectedDateValue) <= 0) {
            window.alert('Value must be a number greater than 0');
            return;
        }

        const originalValue = challengeDetails?.days[selectedDate];

        if (Number(selectedDateValue) === originalValue) {
            window.alert('No changes detected. The value is the same as before.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Not authenticated');
            return;
        }

        try {
            const response = await fetch('/api/get-challenge-details', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    challengeId: selectedChallenge._id,
                    date: selectedDate,
                    value: Number(selectedDateValue),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update value');
            }

            await handleViewChallenge(selectedChallenge);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsNumberInputOpen(false);
        }
    };

    /**
     * Handles the selection of a specific date within the challenge and prepares the input field for progress updates.
     */
    const handleButtonClick = (dateKey) => {
        setSelectedDate(dateKey);
        const value = challengeDetails?.days[dateKey] ?? '';
        setSelectedDateValue(value);
        setIsNumberInputOpen(true);
    };

    return {
        selectedChallenge,
        challengeDetails,
        selectedDate,
        selectedDateValue,
        isNumberInputOpen,
        handleViewChallenge,
        handleSave,
        handleButtonClick,
        setSelectedDateValue,
        setChallengeDetails
    };
};
