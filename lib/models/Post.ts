import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IPost extends Document {
    title: string;
    description: string;
    content: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    authorAvatar: string;
    featured: boolean;
    userId?: string;
    likes: string[];
    ratings: { userId: string; rating: number }[];
    comments: {
        userId: string;
        userName: string;
        userAvatar: string;
        text: string;
        createdAt: Date;
    }[];
    createdAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        date: { type: String, required: true },
        readTime: { type: String, required: true },
        author: { type: String, required: true },
        authorAvatar: { type: String, required: true },
        featured: { type: Boolean, default: false },
        userId: { type: String, default: null },
        likes: { type: [String], default: [] },
        ratings: [
            {
                userId: { type: String, required: true },
                rating: { type: Number, required: true, min: 1, max: 5 },
            },
        ],
        comments: [
            {
                userId: { type: String, required: true },
                userName: { type: String, required: true },
                userAvatar: { type: String, required: true },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Avoid model recompilation in dev (hot reload)
const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;
