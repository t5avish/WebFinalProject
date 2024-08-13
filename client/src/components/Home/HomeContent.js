import React from 'react';

const HomeContent = ({ openSignUpForm }) => {
    return (
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
    );
};

export default HomeContent;
