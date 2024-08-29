export default function handler(req, res) {
  // Ensure the request method is POST; otherwise, return a 405 status
  if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // If the method is POST, respond with a 200 status and a logout message
  res.status(200).json({ message: 'Logged out' });
}
