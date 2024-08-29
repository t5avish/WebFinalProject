import React, { useState, useEffect } from 'react'; 
import SignUpForm from './components/Home/SignUpForm';
import LoginForm from './components/Home/LoginForm';
import Footer from './components/Common/Footer';
import NavBar from './components/Common/NavBar';
import PageContent from './components/Home/PageContent';
import './App.css';

/**
 * Main component of the application that handles navigation, 
 * authentication, and global state management.
 */
const App = () => {
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * Checks for an existing authentication token in localStorage 
     * and sets the logged-in state accordingly on initial load.
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // Functions to manage opening and closing of SignUp and Login forms
    const openSignUpForm = () => setShowSignUpForm(true);
    const closeSignUpForm = () => setShowSignUpForm(false);

    const openLoginForm = () => setShowLoginForm(true);
    const closeLoginForm = () => setShowLoginForm(false);

    /**
     * Navigates to the challenges page if the user is logged in,
     * otherwise displays an alert.
     */
    const goToChallenges = () => {
        if (isLoggedIn) {
            setCurrentPage('challenges');
            setMenuOpen(false);
        } else {
            alert('You must be logged in to access the challenges page.');
        }
    };

    /**
     * Navigates to the home page and closes the menu.
     */
    const goToHome = () => {
        setCurrentPage('home');
        setMenuOpen(false);
    };

    /**
     * Navigates to the profile page if the user is logged in,
     * otherwise displays an alert.
     */
    const goToProfile = () => {
        if (isLoggedIn) {
            setCurrentPage('profile');
            setMenuOpen(false);
        } else {
            alert('You must be logged in to access the profile page.');
        }
    };

    /**
     * Navigates to the posts page if the user is logged in,
     * otherwise displays an alert.
     */
    const goToPosts = () => {
        if (isLoggedIn) {
            setCurrentPage('posts');
            setMenuOpen(false);
        } else {
            alert('You must be logged in to access the posts page.');
        }
    };

    /**
     * Handles user login by setting the logged-in state and closing the login form.
     */
    const handleLogin = () => {
        setIsLoggedIn(true);
        closeLoginForm();
    };

    /**
     * Handles user logout by removing the authentication token,
     * resetting user state, and navigating to the home page.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        goToHome();
        setMenuOpen(false);
    };

    /**
     * Toggles the dark mode state.
     */
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    /**
     * Toggles the menu open and closed.
     */
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className={darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-black'}>
            <NavBar 
                goToHome={goToHome}
                goToChallenges={goToChallenges}
                goToProfile={goToProfile}
                goToPosts={goToPosts}
                toggleDarkMode={toggleDarkMode}
                handleLogout={handleLogout}
                openLoginForm={openLoginForm}
                darkMode={darkMode}
                menuOpen={menuOpen}
                toggleMenu={toggleMenu}
                isLoggedIn={isLoggedIn}
                user={user}
            />

            <PageContent
                currentPage={currentPage}
                isLoggedIn={isLoggedIn}
                goToHome={goToHome}
                user={user}
                openSignUpForm={openSignUpForm}
            />

            {showSignUpForm && <SignUpForm closeModal={closeSignUpForm} />}
            {showLoginForm && <LoginForm closeModal={closeLoginForm} onLogin={handleLogin} />}

            <Footer />
        </div>
    );
};

export default App;
