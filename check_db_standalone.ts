import mongoose, { Schema } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://myblog:root@blogwebsite.5b2fl.mongodb.net/?appName=blogwebsite';

const PostSchema = new Schema(
    {
        title: { type: String },
        userId: { type: Schema.Types.Mixed },
    },
    { strict: false }
);

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function checkDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await Post.countDocuments();
        console.log('Total posts in collection:', count);

        const posts = await Post.find({}).limit(20).lean();
        console.log('userId values in DB:');
        posts.forEach(p => {
            console.log(`- Title: "${p.title}", userId: ${p.userId}, type: ${typeof p.userId}, isObjectId: ${p.userId instanceof mongoose.Types.ObjectId}`);
        });

        // Try to match the user's ID if we knew it. 
        // But let's just see what's there.
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkDB();
