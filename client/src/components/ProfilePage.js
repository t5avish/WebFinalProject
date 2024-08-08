import React, { useEffect, useState } from 'react';
import AvatarSelector from './AvatarSelector';
import 'tailwindcss/tailwind.css';
import { URL } from '../settings';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeDetails, setChallengeDetails] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleButtonClick = (value) => {
    setSelectedDate(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const avatarSrc = require(`../assets/${selectedAvatar}`) 
  const sortedDays = challengeDetails?.days
    ? Object.entries(challengeDetails.days).sort(([keyA], [keyB]) => new Date(keyA) - new Date(keyB))
    : [];

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
            
            {/* User's challenges section */}
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

          {/* Conditionally render the challenge view form */}
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
                  <div className="flex justify-center">
                    <div className="flex items-center">
                      <h2 className="font-bold mr-2">Daily goal:</h2>
                      <h3>{selectedChallenge.goal} {selectedChallenge.measurement === "time" ? "seconds" : "meters"}</h3>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold mb-2">Days:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                      {sortedDays.map(([key, value], index) => (
                        <button
                          key={index}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
                          onClick={() => handleButtonClick(value)}
                        >
                          {formatDate(key)}
                        </button>
                      ))}
                    </div>
                    {selectedDate && (
                      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                        <p className="font-bold mb-2">Details:</p>
                        <textarea
                          value={selectedDate}
                          readOnly
                          className="w-full h-32 border border-gray-300 rounded-md p-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default ProfilePage;
