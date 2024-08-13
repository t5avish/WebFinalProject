import React, { useEffect, useState } from 'react';
import { URL } from '../../settings';
import ChallengeForm from './ChallengeForm';
import ChallengeList from './ChallengeList';
import ChallengesHeader from './ChallengesHeader';  

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
    <>
      {/* Render the ChallengesHeader component */}
      <ChallengesHeader handleAddChallengeClick={handleAddChallengeClick} />

      {/* Render the ChallengeList component */}
      <ChallengeList challenges={challenges} handleJoinChallenge={handleJoinChallenge} />

      {/* Conditionally render the ChallengeForm component */}
      {showForm && (
        <ChallengeForm
          title={title}
          setTitle={setTitle}
          numDays={numDays}
          setNumDays={setNumDays}
          measurement={measurement}
          setMeasurement={setMeasurement}
          goal={goal}
          setGoal={setGoal}
          description={description}
          setDescription={setDescription}
          handleSubmit={handleSubmit}
          handleFormClose={handleFormClose}
        />
      )}
    </>
  );
};

export default ChallengesPage;
