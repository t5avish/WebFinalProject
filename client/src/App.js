import React, { useState, useEffect } from 'react'; //
import SignUpForm from './components/Home/SignUpForm';
import LoginForm from './components/Home/LoginForm';
import Footer from './components/Common/Footer';
import NavBar from './components/Common/NavBar';
import PageContent from './components/Home/PageContent';
import './App.css';

const App = () => {
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const openSignUpForm = () => setShowSignUpForm(true);
    const closeSignUpForm = () => setShowSignUpForm(false);

    const openLoginForm = () => setShowLoginForm(true);
    const closeLoginForm = () => setShowLoginForm(false);

    const goToChallenges = () => {
        if (isLoggedIn) {
            setCurrentPage('challenges');
            setMenuOpen(false);
        } else {
            alert('You must be logged in order to access the challenges page.');
        }
    };

    const goToHome = () => {
        setCurrentPage('home');
        setMenuOpen(false);
    };

    const goToProfile = () => {
        if (isLoggedIn) {
            setCurrentPage('profile');
            setMenuOpen(false);
        } else {
            alert('You must be logged in order to access the profile page.');
        }
    };

    const goToPosts = () => {
        if (isLoggedIn) {
            setCurrentPage('posts');
            setMenuOpen(false);
        } else {
            alert('You must be logged in order to access the posts page.');
        }
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        closeLoginForm();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        goToHome();
        setMenuOpen(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

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