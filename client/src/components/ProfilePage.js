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
          challengeId: challenge._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch challenge details');
      }
      
      const data = await response.json();
      setChallengeDetails(data);
      setSelectedDate(null); // Reset selectedDate when new challenge is selected
      setSelectedDateValue(data.days[null] || ''); // Reset selectedDateValue when new challenge is selected
    } catch (error) {
      setError(error.message);
    }
  };

  const handleButtonClick = (dateKey) => {
    setSelectedDate(dateKey);
    const value = challengeDetails?.days[dateKey] ?? ''; // Default to empty string if not set
    setSelectedDateValue(value); // Set value from the challenge details
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
          value: Number(selectedDateValue) // Ensure value is sent as a number
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update value');
      }

      const data = await response.json();
      console.log('Update success:', data);
      setIsNumberInputOpen(false);
      await handleViewChallenge(selectedChallenge); // Optionally refresh challenge details
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const avatarSrc = require(`../assets/${selectedAvatar}`);
  const sortedDays = challengeDetails?.days
    ? Object.entries(challengeDetails.days).sort(([keyA], [keyB]) => new Date(keyA) - new Date(keyB))
    : [];

  const dataForGraph = sortedDays.filter(([key, value]) => value > 0).map(([key, value]) => ({ date: key, value }));

  // Calculate the average of the Y-axis values
  const total = dataForGraph.reduce((sum, entry) => sum + entry.value, 0);
  const average = dataForGraph.length > 0 ? (total / dataForGraph.length).toFixed(2) : 0;

  // Prepare data for the Daily Goal line
  const dailyGoalLine = dataForGraph.map(() => selectedChallenge.goal);

  const graphData = {
    labels: dataForGraph.map(entry => entry.date),
    datasets: [
      {
        label: `Daily Progress (Avg: ${average})`, // Include the average in the label
        data: dataForGraph.map(entry => entry.value),
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
        borderDash: [10, 5], // Optional: Make the line dashed
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
          maxRotation: 45, // Rotate labels by 45 degrees
          autoSkip: true,  // Automatically skip labels to reduce density
          maxTicksLimit: 7, // Limit to a maximum of 7 labels on the X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: selectedChallenge ? selectedChallenge.measurement : 'Value', // Dynamic Y-axis title
        },
        beginAtZero: true, // Ensure the Y-axis starts at 0
      },
    },
  };





  return (
    <div className="container mx-auto mt-8 p-4">
      {user ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">User Profile</h1>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden cursor-pointer" onClick={() => setIsAvatarSelectorOpen(!isAvatarSelectorOpen)}>
                  <img
                    src={avatarSrc}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h3>
                  <p className="text-gray-600">Age: {user.age}</p>
                  <p className="text-gray-600">Height: {user.height} cm</p>
                  <p className="text-gray-600">Weight: {user.weight} kg</p>
                  <p className="text-gray-600">BMI: {user.bmi}</p>
                </div>
              </div>
            </div>
            {isAvatarSelectorOpen && <AvatarSelector onSelect={handleAvatarSelect} />}
            
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Joined Challenges</h3>
              {user.challenges && user.challenges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.challenges.map((challenge) => (
                    <div key={challenge._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{challenge.title}</h3>
                        <p className="text-gray-600 mb-4">{challenge.description}</p>
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
                <p className="text-gray-600">You haven't joined any challenges yet.</p>
              )}
            </div>
          </div>

          <div className="container mx-auto mt-8 p-4">
            {challengeDetails && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="relative bg-white p-8 rounded-lg shadow-lg">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    aria-label="Close"
                    onClick={() => setChallengeDetails(null)}
                  >
                    X
                  </button>
                  <h1 className="text-2xl font-bold mb-4 text-center">{selectedChallenge.title}</h1>
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center">
                      <h2 className="font-bold mr-2">Daily goal:</h2>
                      <h3>{selectedChallenge.goal} {selectedChallenge.measurement}</h3>
                    </div>
                  </div>
                  {/* Remove the average display in green */}
                  <div className="mt-6">
                    {sortedDays.reduce((rows, [key, value], index) => {
                      if (index % 5 === 0) rows.push([]);
                      rows[rows.length - 1].push(
                        <button
                          key={key}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-2 mr-2"
                          onClick={() => handleButtonClick(key)}
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
                        className="border border-gray-300 p-2 rounded-md mr-2 text-center"
                        style={{ width: '100px' }}
                      />
                      <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* Add the graph below the challenge details */}
                  <div className="mt-8">
                    <Line data={graphData} options={graphOptions} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-600">No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
