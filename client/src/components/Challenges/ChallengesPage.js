import React from 'react';
import ChallengeForm from './ChallengeForm';
import ChallengeList from './ChallengeList';
import ChallengesHeader from './ChallengesHeader';
import { useChallenges, useChallengeForm } from './Hooks';

const ChallengesPage = () => {
  const {
    challenges,
    showForm,
    handleAddChallengeClick,
    handleFormClose,
    handleSubmit,
    handleJoinChallenge,
  } = useChallenges();

  const {
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
  } = useChallengeForm();

  return (
    <>
      <ChallengesHeader handleAddChallengeClick={handleAddChallengeClick} />
      <ChallengeList challenges={challenges} handleJoinChallenge={handleJoinChallenge} />
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
          handleSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ title, numDays, measurement, goal, description });
            resetForm();
          }}
          handleFormClose={() => {
            handleFormClose();
            resetForm();
          }}
        />
      )}
    </>
  );
};

export default ChallengesPage;
