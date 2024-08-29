import { connectToDatabase } from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import cors from '../lib/cors';

/**
 * API route to handle operations related to posts.
 * 
 * This route handles GET, POST, and PUT requests:
 * - GET: Retrieves all posts sorted by date.
 * - POST: Creates a new post with user data and text content.
 * - PUT: Adds a like to a specific post from a user.
 */

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
      const result = await db.collection('posts').insertOne({ user, text, date, likes: [] });

      const newPost = result.insertedId ? { _id: result.insertedId, user, text, date, likes: [] } : null;

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error adding new post:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { postId, userId } = req.body;

      if (!postId || !userId) {
        return res.status(400).json({ message: 'Post ID and User ID are required' });
      }

      const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.likes.includes(userId)) {
        return res.status(400).json({ message: 'User has already liked this post' });
      }

      const update = { $push: { likes: userId } };
      const result = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, update);

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const updatedPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

      res.status(200).json(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
