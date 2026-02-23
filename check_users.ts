import mongoose, { Schema } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://myblog:root@blogwebsite.5b2fl.mongodb.net/?appName=blogwebsite';

async function checkUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.model('User', new Schema({}, { strict: false }));
        const users = await User.find({}).lean();
        console.log('Users in DB:');
        users.forEach(u => {
            console.log(`- Name: ${u.name}, Email: ${u.email}, ID: ${u._id}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkUsers();
