import mongoose, { Schema } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://myblog:root@blogwebsite.5b2fl.mongodb.net/?appName=blogwebsite';
const TARGET_USER_ID = '699c8ba87d4dfb9c49b21304'; // Hollee Rios

async function fixAll() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Post = mongoose.model('Post', new Schema({}, { strict: false }));

        // Update ALL posts to have this userId, or at least those that are null
        const result = await Post.updateMany(
            { $or: [{ userId: null }, { userId: { $exists: false } }] },
            { $set: { userId: TARGET_USER_ID } }
        );

        console.log(`Updated ${result.modifiedCount} posts to userId: ${TARGET_USER_ID}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

fixAll();
