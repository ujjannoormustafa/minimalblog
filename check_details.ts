import mongoose, { Schema } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://myblog:root@blogwebsite.5b2fl.mongodb.net/?appName=blogwebsite';

async function checkDetails() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Post = mongoose.model('Post', new Schema({}, { strict: false }));
        const posts = await Post.find({}).lean();
        console.log('Post details:');
        posts.forEach(p => {
            console.log(`- Title: "${p.title}", Author: "${p.author}", userId: ${p.userId}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkDetails();
