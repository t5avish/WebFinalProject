import React, { useState, useEffect } from 'react';
import SignUpForm from './components/SignUpForm';
import ChallengesPage from './components/ChallengesPage';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';
import Posts from './components/Posts';
import Footer from './components/Footer';
import './App.css';

const App = () => {
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // Store user data
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
            <nav className="bg-gray-800 p-4 relative">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" onClick={goToHome} className="text-white text-2xl font-bold flex items-center">
                            <img src="/Logo1.jpg" alt="Fitness App Logo" className="h-8 w-8 mr-3 object-contain" style={{ borderRadius: '50%' }} /> {/* Add border-radius for rounded logo */}
                            Fitness App
                        </a>
                        {isLoggedIn && user && (
                            <span className="ml-4 text-white">{user.name}</span>  
                        )}
                    </div>
                    <button
                        className="text-white md:hidden"
                        onClick={toggleMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                    <div className={`absolute top-16 right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
                        <div className="py-2 space-y-2">
                            <a href="#" onClick={goToHome} className="block text-gray-300 hover:text-white px-4">Home</a>
                            <a href="#" onClick={goToChallenges} className="block text-gray-300 hover:text-white px-4">Challenges</a>
                            <a href="#" onClick={goToProfile} className="block text-gray-300 hover:text-white px-4">Profile</a>
                            <a href="#" onClick={goToPosts} className="block text-gray-300 hover:text-white px-4">Posts</a>
                            <button
                                onClick={toggleDarkMode}
                                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white bg-gray-500 rounded-lg hover:bg-gray-700"
                            >
                                {darkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white bg-red-500 rounded-lg hover:bg-red-700">Log Out</button>
                            ) : (
                                <button onClick={openLoginForm} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white bg-blue-500 rounded-lg hover:bg-blue-700">Log In</button>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex md:space-x-4 ml-auto items-center">
                        <a href="#" onClick={goToHome} className="text-gray-300 hover:text-white px-4 py-2">Home</a>
                        <a href="#" onClick={goToChallenges} className="text-gray-300 hover:text-white px-4 py-2">Challenges</a>
                        <a href="#" onClick={goToProfile} className="text-gray-300 hover:text-white px-4 py-2">Profile</a>
                        <a href="#" onClick={goToPosts} className="text-gray-300 hover:text-white px-4 py-2">Posts</a>
                        <button
                            onClick={toggleDarkMode}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Log Out</button>
                        ) : (
                            <button onClick={openLoginForm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Log In</button>
                        )}
                    </div>
                </div>
            </nav>

            {currentPage === 'home' && (
                <>
                    <section id="home" className="container mx-auto mt-8 p-4 text-center">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">FITNESS APP</h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Welcome to the Fitness App! Our platform offers a variety of challenges to keep you motivated on your fitness journey.</p>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Whether you're looking to walk 10,000 steps a day or engage in high-intensity workouts, we have something for everyone.</p>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Join us and be a part of a community that strives for health and fitness.</p>
                        <div className="mt-4 space-x-4">
                            <button onClick={openSignUpForm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Create account</button>
                        </div>
                    </section>

                    <section id="how-it-works" className="container mx-auto mt-16 p-4">
                        <h2 className="text-3xl font-bold text-gray-800 text-center dark:text-white mb-8">How it works</h2>
                        <div className="flex flex-wrap items-center justify-center">
                            <div className="w-full lg:w-1/2">
                                <ol className="space-y-8">
                                    <li className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                            <span className="text-2xl">1</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Sign Up</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Create an account with your email and password to start tracking your fitness journey.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                            <span className="text-2xl">2</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Join Challenges</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Explore various fitness challenges and join those that fit your goals and interests.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                            <span className="text-2xl">3</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Track Progress</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Log your workouts and monitor your progress through your profile page.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full">
                                            <span className="text-2xl">4</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Post your achievements</h3>
                                            <p className="text-gray-600 dark:text-gray-400">Share your journey by posting about the challenges you've accomplished and inspire others to reach their fitness goals too.</p>
                                        </div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {currentPage === 'challenges' && <ChallengesPage goBack={goToHome} />}
            {currentPage === 'profile' && isLoggedIn && <ProfilePage />}
            {currentPage === 'posts' && isLoggedIn && <Posts goBack={goToHome} user={user} />}

            {showSignUpForm && <SignUpForm closeModal={closeSignUpForm} />}
            {showLoginForm && <LoginForm closeModal={closeLoginForm} onLogin={handleLogin} />}

            <Footer />
        </div>
    );
};

export default App;
