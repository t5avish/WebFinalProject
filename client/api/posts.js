import { connectToDatabase } from '../lib/mongodb';
import { ObjectId } from 'mongodb';
import cors from '../lib/cors';

export default async function handler(req, res) {
    // Enable CORS to allow cross-origin requests
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

    const db = await connectToDatabase();

    if (req.method === 'GET') {
        try {
            // Fetch all posts from the database, sorted by date (most recent first)
            const posts = await db.collection('posts').find({}).sort({ date: -1 }).toArray();
            res.status(200).json(posts);
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error fetching posts:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { user, text } = req.body;

            // Ensure both user and text are provided
            if (!user || !text) {
                return res.status(400).json({ message: 'User and text are required' });
            }

            const date = new Date().toISOString();
            // Insert a new post into the database
            const result = await db.collection('posts').insertOne({ user, text, date, likes: [] });

            const newPost = result.insertedId ? { _id: result.insertedId, user, text, date, likes: [] } : null;

            res.status(201).json(newPost);
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error adding new post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { postId, userId } = req.body;

            // Ensure both postId and userId are provided
            if (!postId || !userId) {
                return res.status(400).json({ message: 'Post ID and User ID are required' });
            }

            // Find the post in the database
            const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

            // If the post is not found, return a 404 status
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // If the user has already liked the post, return a 400 status
            if (post.likes.includes(userId)) {
                return res.status(400).json({ message: 'User has already liked this post' });
            }

            // Add the user's like to the post
            const update = { $push: { likes: userId } };
            const result = await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, update);

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Return the updated post
            const updatedPost = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

            res.status(200).json(updatedPost);
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Error liking post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        // If the request method is not GET, POST, or PUT, return a 405 status
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
