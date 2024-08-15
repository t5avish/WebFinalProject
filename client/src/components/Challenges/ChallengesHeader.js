import React from 'react';

const ChallengesHeader = ({ handleAddChallengeClick }) => {
  return (
    <section className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Fitness Challenges</h2>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Want to add a new challenge?</h3>
        <button
          onClick={handleAddChallengeClick}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          Add New Challenge
        </button>
      </div>
    </section>
  );
};

export default ChallengesHeader;
