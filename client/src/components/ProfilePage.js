import React, { useEffect, useState } from 'react';
import AvatarSelector from './AvatarSelector';
import 'tailwindcss/tailwind.css';
import { URL } from '../settings'

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

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
          credentials: 'include'
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const avatarSrc = selectedAvatar ? require(`../assets/${selectedAvatar}`) : require('../assets/profile-pic.png');

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
            
            {/* Updated User's challenges section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Joined Challenges</h3>
              {user.challenges && user.challenges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.challenges.map((challenge) => (
                    <div key={challenge._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{challenge.title}</h3>
                        <p className="text-gray-600 mb-4">{challenge.description}</p>
                        <a href="#" className="inline-block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-center">View Challenge</a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">You haven't joined any challenges yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default ProfilePage;