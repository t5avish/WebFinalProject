import React, { useState } from 'react'; // Import useState
import { useUserProfile, useFetchUser, useHandleAvatarSelect, useHandleViewChallenge } from './Hooks';
import UserDetails from './UserDetails';
import ChallengesList from './ChallengesList';
import ChallengeDetails from './ChallengeDetails';
import 'tailwindcss/tailwind.css';

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

    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challengeDetails, setChallengeDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateValue, setSelectedDateValue] = useState('');
    const [isNumberInputOpen, setIsNumberInputOpen] = useState(false);

    useFetchUser(setUser, setLoading, setError, setSelectedAvatar, setAge, setWeight, setHeight);

    const handleAvatarSelect = useHandleAvatarSelect(setSelectedAvatar, setIsAvatarSelectorOpen, setError);
    const handleViewChallenge = useHandleViewChallenge(user, setSelectedChallenge, setChallengeDetails, setSelectedDate, setSelectedDateValue, setError);

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

    const handleButtonClick = (dateKey) => {
        setSelectedDate(dateKey);
        const value = challengeDetails?.days[dateKey] ?? '';
        setSelectedDateValue(value);
        setIsNumberInputOpen(true);
    };

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

            const data = await response.json();
            setIsNumberInputOpen(false);
            await handleViewChallenge(selectedChallenge);
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
