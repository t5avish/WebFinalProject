import React from 'react';
import HomeContent from './HomeContent';
import ChallengesPage from './ChallengesPage';
import ProfilePage from './ProfilePage';
import Posts from './Posts';

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
