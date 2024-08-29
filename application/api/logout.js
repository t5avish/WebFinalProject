
/**
 * API route to handle user logout.
 * 
 * This route accepts only POST requests and simply responds with a success message, 
 * indicating that the user has been logged out. No actual session handling is done 
 * since it relies on client-side token management.
 */

export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    res.status(200).json({ message: 'Logged out' });
  }