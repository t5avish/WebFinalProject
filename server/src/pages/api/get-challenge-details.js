import { MongoClient, ObjectId } from 'mongodb';
import cors from '../../lib/cors';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));
    if (req.method === 'POST') {
        const { userId, challengeId } = req.body;

        if (!userId || !challengeId) {
            return res.status(400).json({ error: 'Missing userId or challengeId' });
        }

        try {
            const db = await connectToDatabase();
            const usersChallenges = db.collection('users_challenges');
            const challenge = await usersChallenges.findOne({
                user_id: new ObjectId(userId),
                challenge_id: new ObjectId(challengeId)
            });

            if (!challenge) {
                return res.status(404).json({ error: 'Challenge not found' });
            }

            res.status(200).json({
                challengeId: challenge.challenge_id,
                userId: challenge.user_id,
                days: challenge.days
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {  // Add a PUT method to handle updates
        const { userId, challengeId, date, value } = req.body;

        if (!userId || !challengeId || !date || value == null) {
            return res.status(400).json({ error: 'Missing userId, challengeId, date, or value' });
        }

        try {
            const db = await connectToDatabase();
            const usersChallenges = db.collection('users_challenges');

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

            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Challenge or date not found' });
            }

            res.status(200).json({ message: 'Value updated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
