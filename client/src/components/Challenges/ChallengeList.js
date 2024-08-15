import React from 'react';

const ChallengeList = ({ challenges, handleJoinChallenge }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {challenges.map((challenge) => (
        <div key={challenge._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{challenge.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
          <button
            onClick={() => handleJoinChallenge(challenge._id)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Join Challenge
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChallengeList;
