import { connectToDatabase } from '../lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import cors from '../lib/cors';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    // Enable CORS to allow cross-origin requests
    await new Promise((resolve, reject) => cors(req, res, (result) => (result instanceof Error ? reject(result) : resolve())));

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
    
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        try {
            // Find the user in the database by ID from the decoded token
            const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });

            // If the user is not found, return a 404 status
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Calculate the user's BMI based on their height and weight
            const height = user.height;
            const weight = user.weight;
            const heightInMeters = height / 100;
            const bmi = (weight / (heightInMeters ** 2)).toFixed(2);

            // Fetch the user's challenges from the database
            const userChallenges = await db.collection('users_challenges').find({ user_id: new ObjectId(decoded.userId) }).toArray();
            const challengeIds = userChallenges.map(uc => new ObjectId(uc.challenge_id));
            const challenges = await db.collection('challenges').find({ _id: { $in: challengeIds } }).toArray();

            // Return the user's profile information
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
            // Log the error and return a 500 status
            console.error('Profile fetch error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'POST') {
        // Handle POST requests to update the user's avatar
        const { avatar } = req.body;

        // Ensure the avatar is provided
        if (!avatar) {
            return res.status(400).json({ message: 'Avatar is required' });
        }

        try {
            // Update the user's avatar in the database
            await db.collection('users').updateOne(
                { _id: new ObjectId(decoded.userId) },
                { $set: { avatar } }
            );
            res.status(200).json({ message: 'Avatar updated successfully' });
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Avatar update error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else if (req.method === 'PUT') {
        // Handle PUT requests to update the user's age, weight, and height
        const { age, weight, height } = req.body;

        // Ensure all fields are provided
        if (age === undefined || weight === undefined || height === undefined) {
            return res.status(400).json({ message: 'All fields (age, weight, height) are required' });
        }

        try {
            // Update the user's age, weight, and height in the database
            await db.collection('users').updateOne(
                { _id: new ObjectId(decoded.userId) },
                { $set: { age, weight, height } }
            );

            // Recalculate the BMI after the update
            const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
            const heightInMeters = updatedUser.height / 100;
            const bmi = (updatedUser.weight / (heightInMeters ** 2)).toFixed(2);
            updatedUser.bmi = bmi;

            // Fetch the user's updated challenges
            const userChallenges = await db.collection('users_challenges').find({ user_id: new ObjectId(decoded.userId) }).toArray();
            const challengeIds = userChallenges.map(uc => new ObjectId(uc.challenge_id));
            const challenges = await db.collection('challenges').find({ _id: { $in: challengeIds } }).toArray();

            // Return the updated profile information
            res.status(200).json({
                ...updatedUser,
                challenges: challenges
            });
        } catch (error) {
            // Log the error and return a 500 status
            console.error('Profile update error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        // If the request method is not GET, POST, or PUT, return a 405 status
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
