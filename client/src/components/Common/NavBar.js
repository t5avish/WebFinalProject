import React from 'react';

/**
 * NavBar component for the Fitness App.
 * Handles navigation between different sections and includes dark mode toggle and login/logout functionality.
 */
const NavBar = ({
    goToHome,
    goToChallenges,
    goToProfile,
    goToPosts,
    toggleDarkMode,
    handleLogout,
    openLoginForm,
    darkMode,
    menuOpen,
    toggleMenu,
    isLoggedIn,
    user
}) => {
    return (
        <nav className="bg-gray-800 p-4 relative">
            <div className="container mx-auto flex justify-between items-center">
                {/* App Logo and Home Link */}
                <div className="flex items-center">
                    <a href="#" onClick={goToHome} className="text-white text-2xl font-bold flex items-center">
                        <img src="/Logo1.jpg" alt="Fitness App Logo" className="h-8 w-8 mr-3 object-contain" style={{ borderRadius: '50%' }} />
                        Fitness App
                    </a>
                    {/* Display user name if logged in */}
                    {isLoggedIn && user && (
                        <span className="ml-4 text-white">{user.name}</span>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <button className="text-white md:hidden" onClick={toggleMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>

                {/* Mobile Dropdown Menu */}
                <div className={`absolute top-16 right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
                    <div className="py-2 space-y-2">
                        <a href="#" onClick={goToHome} className="block text-gray-300 hover:text-white px-4">Home</a>
                        <a href="#" onClick={goToChallenges} className="block text-gray-300 hover:text-white px-4">Challenges</a>
                        <a href="#" onClick={goToProfile} className="block text-gray-300 hover:text-white px-4">Profile</a>
                        <a href="#" onClick={goToPosts} className="block text-gray-300 hover:text-white px-4">Posts</a>
                        {/* Toggle Dark Mode */}
                        <button
                            onClick={toggleDarkMode}
                            className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white bg-gray-500 rounded-lg hover:bg-gray-700"
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        {/* Logout or Login Button */}
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white bg-red-500 rounded-lg hover:bg-red-700">Log Out</button>
                        ) : (
                            <button onClick={openLoginForm} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white bg-blue-500 rounded-lg hover:bg-blue-700">Log In</button>
                        )}
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:space-x-4 ml-auto items-center">
                    <a href="#" onClick={goToHome} className="text-gray-300 hover:text-white px-4 py-2">Home</a>
                    <a href="#" onClick={goToChallenges} className="text-gray-300 hover:text-white px-4 py-2">Challenges</a>
                    <a href="#" onClick={goToProfile} className="text-gray-300 hover:text-white px-4 py-2">Profile</a>
                    <a href="#" onClick={goToPosts} className="text-gray-300 hover:text-white px-4 py-2">Posts</a>
                    {/* Toggle Dark Mode */}
                    <button
                        onClick={toggleDarkMode}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    {/* Logout or Login Button */}
                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Log Out</button>
                    ) : (
                        <button onClick={openLoginForm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Log In</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
