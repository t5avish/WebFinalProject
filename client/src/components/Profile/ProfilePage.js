import React from 'react';
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

    useFetchUser(setUser, setLoading, setError, setSelectedAvatar, setAge, setWeight, setHeight);
    const handleAvatarSelect = useHandleAvatarSelect(setSelectedAvatar, setIsAvatarSelectorOpen, setError);
    const handleViewChallenge = useHandleViewChallenge(user, setSelectedChallenge, setChallengeDetails, setSelectedDate, setSelectedDateValue, setError);

    // The rest of your ProfilePage component logic remains the same

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
