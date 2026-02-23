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
    },
    { timestamps: true }
);

// Avoid model recompilation in dev (hot reload)
const Post = models.Post || model<IPost>('Post', PostSchema);

export default Post;
