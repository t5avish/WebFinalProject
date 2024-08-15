import { useState, useEffect } from 'react';

// Custom hook for handling the form state
export const useChallengeForm = () => {
  const [title, setTitle] = useState('');
  const [numDays, setNumDays] = useState('');
  const [measurement, setMeasurement] = useState('seconds');
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setTitle('');
    setNumDays('');
    setMeasurement('seconds');
    setGoal('');
    setDescription('');
  };

  return {
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
    resetForm,
  };
};

// Custom hook for handling challenge operations
export const useChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/challenges', {
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

  const handleAddChallengeClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleSubmit = async (challengeData) => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      });
      if (response.ok) {
        const newChallenge = await response.json();
        setChallenges([...challenges, newChallenge]);
        handleFormClose();
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

      const response = await fetch('/api/challenges', {
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

  return {
    challenges,
    showForm,
    setShowForm,
    handleAddChallengeClick,
    handleFormClose,
    handleSubmit,
    handleJoinChallenge,
  };
};
