import { connectToDatabase } from '../lib/mongodb';
import jwt from 'jsonwebtoken';
import cors from '../lib/cors';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * API route to handle user login.
 * 
 * This route accepts POST requests with user credentials (email and password).
 * It validates the credentials against the database, and if successful, 
 * returns a JWT token for authentication. The token is signed with a secret key.
 */

export default async function handler(req, res) {
  await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() }); // Await the result

    if (!user || password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
