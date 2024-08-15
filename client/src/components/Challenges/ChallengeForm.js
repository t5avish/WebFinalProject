import React from 'react';

const ChallengeForm = ({
  title,
  setTitle,
  numDays,
  setNumDays,
  measurement,
  setMeasurement,
  goal,
  setGoal,
  description,
  setDescription,
  handleSubmit,
  handleFormClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <button
          onClick={handleFormClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          X
        </button>
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Challenge</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Number of days:</label>
            <input
              type="number"
              value={numDays}
              onChange={(e) => setNumDays(e.target.value)}
              className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Type of measurement:</label>
            <select
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="seconds">Time (seconds)</option>
              <option value="minutes">Time (minutes)</option>
              <option value="meters">Length (meters)</option>
              <option value="km">Length (km)</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Daily goal:</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChallengeForm;
