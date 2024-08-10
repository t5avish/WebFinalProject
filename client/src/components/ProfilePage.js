import React, { useEffect, useState } from 'react';
import AvatarSelector from './AvatarSelector';
import 'tailwindcss/tailwind.css';
import { URL } from '../settings';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeDetails, setChallengeDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [isNumberInputOpen, setIsNumberInputOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(URL + 'profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
        setSelectedAvatar(data.avatar);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    setIsAvatarSelectorOpen(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch(URL + 'profile', {
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

  const handleViewChallenge = async (challenge) => {
    setSelectedChallenge(challenge);

    try {
      const response = await fetch(URL + 'get-challenge-details', {
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
        throw new Error('Failed to fetch challenge details');
      }

      const data = await response.json();
      setChallengeDetails(data);
      setSelectedDate(null);
      setSelectedDateValue(data.days[null] || '');
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

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch(URL + 'get-challenge-details', {
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
      console.log('Update success:', data);
      setIsNumberInputOpen(false);
      await handleViewChallenge(selectedChallenge);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p className="text-gray-800 dark:text-white">Loading...</p>;
  if (error) return <p className="text-red-500 dark:text-red-300">Error: {error}</p>;

  const avatarSrc = require(`../assets/${selectedAvatar}`);
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
    <div className="container mx-auto mt-8 p-4 text-gray-800 dark:text-white">
      {user ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">User Profile</h1>
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
                  <h3 className="text-2xl font-bold mb-2">{user.name}</h3>
                  <p>Age: {user.age}</p>
                  <p>Height: {user.height} cm</p>
                  <p>Weight: {user.weight} kg</p>
                  <p>BMI: {user.bmi}</p>
                </div>
              </div>
            </div>
            {isAvatarSelectorOpen && <AvatarSelector onSelect={handleAvatarSelect} />}

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
          </div>

          <div className="container mx-auto mt-8 p-4">
            {challengeDetails && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50 p-4">
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-[90vh]">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Close"
                    onClick={() => setChallengeDetails(null)}
                  >
                    X
                  </button>
                  <h1 className="text-2xl font-bold mb-4 text-center">{selectedChallenge.title}</h1>
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center">
                      <h2 className="font-bold mr-2 text-gray-800 dark:text-white">Daily goal:</h2>
                      <h3 className="text-gray-600 dark:text-gray-400">{selectedChallenge.goal} {selectedChallenge.measurement}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {sortedDays.reduce((rows, [key, value], index) => {
                      if (index % 5 === 0) rows.push([]);
                      rows[rows.length - 1].push(
                        <button
                          key={key}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-2"
                          onClick={() => handleButtonClick(key)}
                          style={{ minWidth: '100px' }}
                        >
                          {key}
                        </button>
                      );
                      return rows;
                    }, []).map((row, i) => (
                      <div key={i} className="flex flex-wrap justify-center mb-2">{row}</div>
                    ))}
                  </div>

                  {isNumberInputOpen && (
                    <div className="flex items-center justify-center mt-4">
                      <input
                        type="number"
                        value={selectedDateValue}
                        onChange={(e) => setSelectedDateValue(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 rounded-md mr-2 text-center w-20"
                      />
                      <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  <div className="mt-8">
                    <Line data={graphData} options={graphOptions} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
