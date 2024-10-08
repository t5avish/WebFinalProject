import React from 'react';

/**
 * Footer component for the Fitness App.
 * Displays the copyright notice at the bottom of the page.
 */
function Footer() {
    return (
        <footer className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-center py-4 mt-auto">
            <div className="container mx-auto">
                <p>© 2024 Fitness App</p>
            </div>
        </footer>
    );
}

export default Footer;
