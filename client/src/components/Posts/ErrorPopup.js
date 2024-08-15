import React from 'react';

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 z-30"
        >
          &times;
        </button>
        <p className="text-gray-800 dark:text-white mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
