import React, { useEffect, useState } from 'react';
import { URL } from '../settings';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [numDays, setNumDays] = useState('');
  const [measurement, setMeasurement] = useState('seconds');
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(URL + 'challenges', {
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
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description || !numDays || !goal) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(URL + 'challenges', {
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

  const handleJoinChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const response = await fetch(URL + 'challenges', {
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

  return (
    <section id="challenges" className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">Fitness Challenges</h2>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Want to add a new challenge?</h3>
        <button onClick={handleAddChallengeClick} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500">Add New Challenge</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {challenges.map(challenge => (
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

      {showForm && (
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
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500">Submit</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChallengesPage;
