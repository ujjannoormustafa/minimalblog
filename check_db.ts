import * as fs from 'fs';
import * as path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

import mongoose from 'mongoose';
import Post from './lib/models/Post';
import { connectDB } from './lib/mongodb';

async function checkDB() {
    await connectDB();
    const count = await Post.countDocuments();
    console.log('Total posts:', count);

    const posts = await Post.find({}).limit(10).lean();
    posts.forEach(p => {
        console.log(`Title: ${p.title}, userId: ${p.userId}, type: ${typeof p.userId}`);
        if (p.userId && typeof p.userId === 'object') {
            console.log('userId is an object (possibly ObjectId)');
        }
    });

    process.exit();
}

checkDB();
