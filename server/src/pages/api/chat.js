import { connectToDatabase } from '../../lib/mongodb';
import cors from '../../lib/cors';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

  const db = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const posts = await db.collection('posts').find({}).sort({ date: -1 }).toArray();
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { user, text } = req.body;

      if (!user || !text) {
        return res.status(400).json({ message: 'User and text are required' });
      }

      const date = new Date().toISOString();
      const result = await db.collection('posts').insertOne({ user, text, date });

      const newPost = result.insertedId ? { _id: result.insertedId, user, text, date } : null;

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error adding new post:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
