import React from 'react';
import { useSignUpForm } from './HomeHooks';

/**
 * SignUpForm component.
 * 
 * Handles the sign-up process by capturing user details, validating input,
 * and submitting the form.
 */
const SignUpForm = ({ closeModal }) => {
    const {
        formData, handleChange,
        errorMessage, successMessage,
        handleSubmit
    } = useSignUpForm({ closeModal });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10 dark:bg-opacity-70">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg relative z-20 w-full max-w-lg">
                <button 
                    onClick={closeModal} 
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 z-30"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Sign Up</h2>
                {errorMessage && <div className="mb-4 text-red-500 dark:text-red-300">{errorMessage}</div>}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Input fields for user information */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="given-name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="family-name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="age" className="block text-gray-700 dark:text-gray-300">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="age"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="weight" className="block text-gray-700 dark:text-gray-300">Weight (kg)</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="weight"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-gray-700 dark:text-gray-300">Height (cm)</label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="height"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-gray-700 dark:text-gray-300">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    autoComplete="gender"
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        Sign Up
                    </button>
                </form>
                {successMessage && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow-lg z-30">
                        <p className="text-green-500 dark:text-green-300">User created successfully!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUpForm;
