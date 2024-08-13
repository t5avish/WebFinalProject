import React from 'react';
import HomeContent from './HomeContent';
import ChallengesPage from '../Challenges/ChallengesPage';
import ProfilePage from '../Profile/ProfilePage';
import Posts from '../Posts/Posts';

const PageContent = ({ currentPage, isLoggedIn, goToHome, user, openSignUpForm }) => {
    return (
        <>
            {currentPage === 'home' && <HomeContent openSignUpForm={openSignUpForm} />}
            {currentPage === 'challenges' && <ChallengesPage goBack={goToHome} />}
            {currentPage === 'profile' && isLoggedIn && <ProfilePage />}
            {currentPage === 'posts' && isLoggedIn && <Posts goBack={goToHome} user={user} />}
        </>
    );
};

export default PageContent;
