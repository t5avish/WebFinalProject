import { connectToDatabase } from '../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const db = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const height = user.height;
      const weight = user.weight;
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters ** 2)).toFixed(2);

      // Fetch user's challenges
      const userChallenges = await db.collection('users_challenges').find({ user_id: new ObjectId(decoded.userId) }).toArray();
      const challengeIds = userChallenges.map(uc => new ObjectId(uc.challenge_id));
      const challenges = await db.collection('challenges').find({ _id: { $in: challengeIds } }).toArray();

      res.status(200).json({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        age: user.age,
        height: height,
        weight: weight,
        bmi: bmi,
        avatar: user.avatar,
        challenges: challenges,
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: 'Avatar is required' });
    }

    try {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { avatar } }
      );
      res.status(200).json({ message: 'Avatar updated successfully' });
    } catch (error) {
      console.error('Avatar update error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { age, weight, height } = req.body;

    if (age === undefined || weight === undefined || height === undefined) {
      return res.status(400).json({ message: 'All fields (age, weight, height) are required' });
    }

    try {
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { age, weight, height } }
      );

      const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
      const heightInMeters = updatedUser.height / 100;
      const bmi = (updatedUser.weight / (heightInMeters ** 2)).toFixed(2);
      updatedUser.bmi = bmi;

      // Fetch user's challenges
      const userChallenges = await db.collection('users_challenges').find({ user_id: new ObjectId(decoded.userId) }).toArray();
      const challengeIds = userChallenges.map(uc => new ObjectId(uc.challenge_id));
      const challenges = await db.collection('challenges').find({ _id: { $in: challengeIds } }).toArray();

      res.status(200).json({
        ...updatedUser,
        challenges: challenges
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
