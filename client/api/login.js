import { connectToDatabase } from '../lib/mongodb';
import jwt from 'jsonwebtoken';
import cors from '../lib/cors';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    // Enable CORS to allow cross-origin requests
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Connect to the MongoDB database
        const db = await connectToDatabase();
        // Find the user in the database by email
        const user = await db.collection('users').findOne({ email: email.toLowerCase() }); 

        // If the user doesn't exist or the password is incorrect, return a 401 status
        if (!user || password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        // Log the error and return a 500 status
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
