import React from 'react';
import { useLoginForm } from './Hooks';

const LoginForm = ({ closeModal, onLogin }) => {
  const { email, setEmail, password, setPassword, error, handleSubmit } = useLoginForm({ onLogin, closeModal });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10 dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg relative z-20 w-full max-w-lg">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 z-30">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Login</h2>
        {error && <p className="text-red-500 dark:text-red-300">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
