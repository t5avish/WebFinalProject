import React from 'react';
import AvatarSelector from './AvatarSelector';

/**
 * Renders the user's profile details including name, age, height, weight,
 * and BMI. Allows the user to edit these details and select a profile avatar.
 * The form for editing includes options to save or cancel changes.
 */
const UserDetails = ({
    user,
    editing,
    setEditing,
    age,
    setAge,
    height,
    setHeight,
    weight,
    setWeight,
    handleSaveProfile,
    setIsAvatarSelectorOpen,
    selectedAvatar,
    isAvatarSelectorOpen,
    handleAvatarSelect
}) => {
    const avatarSrc = selectedAvatar ? require(`../../assets/${selectedAvatar}`) : null;

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-8">User Details</h1>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-12">
                    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer" onClick={() => setIsAvatarSelectorOpen(!isAvatarSelectorOpen)}>
                            <img
                                src={avatarSrc}
                                alt="Profile Picture"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{user.name}</p>
                            {editing ? (
                                <>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 dark:text-gray-300">Age:</label>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 dark:text-gray-300">Height (cm):</label>
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label className="block text-gray-700 dark:text-gray-300">Weight (kg):</label>
                                        <input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg">Age: {user.age}</p>
                                    <p className="text-lg">Height: {user.height} cm</p>
                                    <p className="text-lg">Weight: {user.weight} kg</p>
                                    <p className="text-lg">BMI: {user.bmi}</p>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {isAvatarSelectorOpen && <AvatarSelector onSelect={handleAvatarSelect} />}
            </div>
        </>
    );
};

export default UserDetails;
