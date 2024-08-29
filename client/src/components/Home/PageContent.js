import React from 'react';
import HomeContent from './HomeContent';
import ChallengesPage from '../Challenges/ChallengesPage';
import ProfilePage from '../Profile/ProfilePage';
import Posts from '../Posts/Posts';

/**
 * PageContent component.
 * 
 * Dynamically renders the content of the page based on the currentPage prop.
 * Handles conditional rendering of home, challenges, profile, and posts pages.
 */
const PageContent = ({ currentPage, isLoggedIn, goToHome, user, openSignUpForm }) => {
    return (
        <>
            {/* Render the appropriate page content based on the current page */}
            {currentPage === 'home' && <HomeContent openSignUpForm={openSignUpForm} />}
            {currentPage === 'challenges' && <ChallengesPage goBack={goToHome} />}
            {currentPage === 'profile' && isLoggedIn && <ProfilePage />}
            {currentPage === 'posts' && isLoggedIn && <Posts goBack={goToHome} user={user} />}
        </>
    );
};

export default PageContent;
