import React from 'react';
import {
    useChallenges,
    useFetchChallenges,
    useHandleSubmitChallenge,
    useHandleJoinChallenge,
    useHandleFormVisibility
} from './ChallengesHooks';
import ChallengeForm from './ChallengeForm';
import ChallengeList from './ChallengeList';
import ChallengesHeader from './ChallengesHeader';

/**
 * ChallengesPage component combines all the subcomponents to create the main challenges page.
 * It handles fetching, displaying, and managing challenges.
 */
const ChallengesPage = () => {
    const {
        challenges, setChallenges,
        showForm, setShowForm,
        title, setTitle,
        numDays, setNumDays,
        measurement, setMeasurement,
        goal, setGoal,
        description, setDescription
    } = useChallenges();

    useFetchChallenges({ setChallenges });

    const handleSubmit = useHandleSubmitChallenge({
        challenges, setChallenges, title, setTitle,
        numDays, setNumDays, measurement, setMeasurement,
        goal, setGoal, description, setDescription, setShowForm
    });

    const handleJoinChallenge = useHandleJoinChallenge();

    const { handleFormClose, handleAddChallengeClick } = useHandleFormVisibility({
        setShowForm, setTitle, setNumDays, setMeasurement, setGoal, setDescription
    });

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
                    handleSubmit={handleSubmit}
                    handleFormClose={handleFormClose}
                />
            )}
        </>
    );
};

export default ChallengesPage;
