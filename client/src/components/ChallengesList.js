import React from 'react';

const ChallengesList = ({ user, handleViewChallenge }) => {
    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Joined Challenges</h3>
            {user.challenges && user.challenges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.challenges.map((challenge) => (
                        <div key={challenge._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
                                <p className="mb-4">{challenge.description}</p>
                                <button
                                    onClick={() => handleViewChallenge(challenge)}
                                    className="inline-block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-center"
                                >
                                    View Challenge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't joined any challenges yet.</p>
            )}
        </div>
    );
};

export default ChallengesList;
