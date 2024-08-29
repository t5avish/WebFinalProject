import { connectToDatabase } from '../lib/mongodb';  
import cors from '../lib/cors';

export default async function handler(req, res) {
    // Enable CORS to allow cross-origin requests
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

    // Handle POST requests for user signup
    if (req.method === 'POST') {
        try {
            // Connect to the MongoDB database
            const db = await connectToDatabase();
            const usersCollection = db.collection('users');
            let { firstName, lastName, email, password, age, weight, height, gender } = req.body;

            // Convert email to lowercase for consistent comparison
            email = email.toLowerCase();

            // Check if the email already exists in the database
            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                res.status(409).json({ message: 'Email already exists' });
                return;
            }

            // Insert the new user into the database with a default avatar
            const result = await usersCollection.insertOne({ firstName, lastName, email, password, age, weight, height, gender, avatar: 'profile-pic.png' });
            res.status(200).json({ userId: result.insertedId });
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error during user creation:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // If the request method is not POST, return a 405 status
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
