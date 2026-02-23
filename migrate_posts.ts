import mongoose, { Schema } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://myblog:root@blogwebsite.5b2fl.mongodb.net/?appName=blogwebsite';

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.model('User', new Schema({}, { strict: false }));
        const Post = mongoose.model('Post', new Schema({}, { strict: false }));

        const users = await User.find({}).lean();
        const posts = await Post.find({ userId: { $exists: false } }).lean();

        console.log(`Found ${posts.length} posts without userId.`);

        for (const post of posts) {
            // Find user by name
            const user = users.find(u => u.name === post.author);
            if (user) {
                await Post.updateOne({ _id: post._id }, { $set: { userId: user._id.toString() } });
                console.log(`Linked post "${post.title}" to user "${user.name}" (${user._id})`);
            } else {
                console.log(`Could not find user for post "${post.title}" (Author: ${post.author})`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

migrate();
