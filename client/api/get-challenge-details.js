import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../lib/mongodb';
import cors from '../lib/cors';

export default async function handler(req, res) {
    // Enable CORS to allow cross-origin requests
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

    if (req.method === 'POST') {
        // Extract userId and challengeId from the request body
        const { userId, challengeId } = req.body;

        // Check if both userId and challengeId are provided
        if (!userId || !challengeId) {
            return res.status(400).json({ error: 'Missing userId or challengeId' });
        }

        try {
            // Connect to the MongoDB database
            const db = await connectToDatabase();
            // Find the specific challenge for the user
            const challenge = await db.collection('users_challenges').findOne({
                user_id: new ObjectId(userId),
                challenge_id: new ObjectId(challengeId)
            });

            // If no challenge is found, return a 404 status
            if (!challenge) {
                return res.status(404).json({ error: 'Challenge not found' });
            }

            // Return the challenge details
            res.status(200).json({
                challengeId: challenge.challenge_id,
                userId: challenge.user_id,
                days: challenge.days
            });
        } catch (error) {
            // Log the error and return a 500 status
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {  
        // Handle PUT requests to update challenge details
        const { userId, challengeId, date, value } = req.body;

        // Ensure all required fields are provided
        if (!userId || !challengeId || !date || value == null) {
            return res.status(400).json({ error: 'Missing userId, challengeId, date, or value' });
        }

        try {
            // Connect to the MongoDB database
            const db = await connectToDatabase();

            // Update the specific date's value for the user's challenge
            const result = await usersChallenges.updateOne(
                {
                    user_id: new ObjectId(userId),
                    challenge_id: new ObjectId(challengeId)
                },
                {
                    $set: {
                        [`days.${date}`]: value
                    }
                }
            );

            // If no challenge or date is found, return a 404 status
            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Challenge or date not found' });
            }

            // Return a success message
            res.status(200).json({ message: 'Value updated successfully' });
        } catch (error) {
            // Log the error and return a 500 status
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // If the request method is not POST or PUT, return a 405 status
        res.setHeader('Allow', ['POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
