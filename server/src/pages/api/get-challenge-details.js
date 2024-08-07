import { MongoClient } from 'mongodb';
import cors from '../../lib/cors';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';


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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
