import React from 'react';
import { useUserProfile, useFetchUser, useHandleAvatarSelect, useHandleChallenge } from './ProfileHooks';
import UserDetails from './UserDetails';
import ChallengesList from './ChallengesList';
import ChallengeDetails from './ChallengeDetails';
import 'tailwindcss/tailwind.css';

/**
 * Main component for the user's profile page.
 * Handles the display of user details, list of challenges the user has joined,
 * and details of selected challenges. Utilizes several custom hooks
 * to manage the state, fetch data, and handle user interactions.
 */
const ProfilePage = () => {
    const {
        user, setUser,
        loading, setLoading,
        error, setError,
        selectedAvatar, setSelectedAvatar,
        isAvatarSelectorOpen, setIsAvatarSelectorOpen,
        editing, setEditing,
        age, setAge,
        weight, setWeight,
        height, setHeight
    } = useUserProfile();

    useFetchUser({ setUser, setLoading, setError, setSelectedAvatar, setAge, setWeight, setHeight });

    const handleAvatarSelect = useHandleAvatarSelect({
        setSelectedAvatar, setIsAvatarSelectorOpen, setError
    });

    const {
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
    } = useHandleChallenge({ user, setError });

    const handleSaveProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Not authenticated');
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ age, weight, height }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p className="text-gray-800 dark:text-white">Loading...</p>;
    if (error) return <p className="text-red-500 dark:text-red-300">Error: {error}</p>;

    const sortedDays = challengeDetails?.days
        ? Object.entries(challengeDetails.days).sort(([keyA], [keyB]) => new Date(keyA) - new Date(keyB))
        : [];

    const dataForGraph = sortedDays.filter(([key, value]) => value > 0).map(([key, value]) => ({ date: key, value }));

    const total = dataForGraph.reduce((sum, entry) => sum + entry.value, 0);
    const average = dataForGraph.length > 0 ? (total / dataForGraph.length).toFixed(2) : 0;

    const dailyGoalLine = dataForGraph.map(() => selectedChallenge.goal);

    const graphData = {
        labels: dataForGraph.map((entry) => entry.date),
        datasets: [
            {
                label: `Daily Progress (Avg: ${average})`,
                data: dataForGraph.map((entry) => entry.value),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Daily Goal',
                data: dailyGoalLine,
                fill: false,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgb(255, 0, 0)',
                borderDash: [10, 5],
            },
        ],
    };

    const graphOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Dates',
                },
                ticks: {
                    maxRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 7,
                },
            },
            y: {
                title: {
                    display: true,
                    text: selectedChallenge ? selectedChallenge.measurement : 'Value',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow container mx-auto mt-8 p-4 text-gray-800 dark:text-white">
                {user ? (
                    <>
                        <UserDetails
                            user={user}
                            editing={editing}
                            setEditing={setEditing}
                            age={age}
                            setAge={setAge}
                            height={height}
                            setHeight={setHeight}
                            weight={weight}
                            setWeight={setWeight}
                            handleSaveProfile={handleSaveProfile}
                            setIsAvatarSelectorOpen={setIsAvatarSelectorOpen}
                            selectedAvatar={selectedAvatar}
                            isAvatarSelectorOpen={isAvatarSelectorOpen}
                            handleAvatarSelect={handleAvatarSelect}
                        />

                        <ChallengesList user={user} handleViewChallenge={handleViewChallenge} />

                        {challengeDetails && (
                            <ChallengeDetails
                                challengeDetails={challengeDetails}
                                selectedChallenge={selectedChallenge}
                                sortedDays={sortedDays}
                                handleButtonClick={handleButtonClick}
                                isNumberInputOpen={isNumberInputOpen}
                                selectedDateValue={selectedDateValue}
                                setSelectedDateValue={setSelectedDateValue}
                                handleSave={handleSave}
                                graphData={graphData}
                                graphOptions={graphOptions}
                                setChallengeDetails={setChallengeDetails}
                            />
                        )}
                    </>
                ) : (
                    <p>No user data available.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
