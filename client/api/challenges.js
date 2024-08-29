import { connectToDatabase } from '../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import cors from '../lib/cors';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    // Enable CORS to allow cross-origin requests
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

    const db = await connectToDatabase();

    if (req.method === 'GET') {
        try {
            // Fetch all challenges from the database
            const challenges = await db.collection('challenges').find({}).toArray();
            res.status(200).json(challenges);
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error fetching challenges:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { title, description, numDays, measurement, goal } = req.body;

            // Ensure all fields are provided
            if (!title || !description || numDays === undefined || !measurement || goal === undefined) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Insert a new challenge into the database
            const result = await db.collection('challenges').insertOne({ title, description, numDays, measurement, goal });

            const newChallenge = result.insertedId ? { _id: result.insertedId, title, description, numDays, measurement, goal } : null;

            res.status(201).json(newChallenge);
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error adding new challenge:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            // Extract the JWT token from the authorization header
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            let decoded;
            try {
                // Verify the JWT token
                decoded = jwt.verify(token, JWT_SECRET);
            } catch (error) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Find the user associated with the decoded JWT token
            const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

            const { challengeId, overwrite } = req.body;

            // Ensure the user exists and the challenge ID is provided
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!challengeId) {
                return res.status(400).json({ message: 'Challenge ID is required' });
            }

            // Find the specific challenge in the database
            const challenge = await db.collection('challenges').findOne({ _id: new ObjectId(challengeId) });

            // If the challenge is not found, return a 404 status
            if (!challenge) {
                return res.status(404).json({ message: 'Challenge not found' });
            }

            // Prepare a structure for tracking challenge days
            const days = {};
            const today = new Date();
            for (let i = 0; i < challenge.numDays; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const formattedDate = date.toISOString().split('T')[0];
                days[formattedDate] = 0;
            }

            console.log('Days structure:', days); // Log the days structure

            // Update the user's challenge days if overwrite is true
            if (overwrite) {
                const updateResult = await db.collection('users_challenges').updateOne(
                    { user_id: user._id, challenge_id: new ObjectId(challengeId) },
                    {
                        $set: {
                            days: days
                        }
                    },
                    { upsert: true }
                );
                console.log('Update result:', updateResult); // Log update result
                res.status(200).json({ message: 'Challenge updated successfully' });
            } else {
                // Insert a new challenge for the user
                const insertResult = await db.collection('users_challenges').insertOne({
                    challenge_id: challenge._id,
                    user_id: user._id,
                    days: days
                });
                console.log('Insert result:', insertResult); // Log insert result
                res.status(201).json({ message: 'Joined challenge successfully', data: insertResult.insertedId });
            }
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error joining challenge:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        // If the request method is not GET, POST, or PUT, return a 405 status
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
