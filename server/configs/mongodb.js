import mongoose from "mongoose";


// connect to mongoDb database

const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database connected successfully!'));

    // Use the MONGODB_URI as provided. If it already includes a database name,
    // do not append an additional path (avoids invalid namespace like `db1/db2.collection`).
    const rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const uriNoQuery = rawUri.split('?')[0];

    // Get the portion after the host. If there's a slash after the host, assume a DB name is present.
    // Handle both `mongodb://host:port/db` and `mongodb+srv://user:pass@host/db` forms.
    const afterHost = uriNoQuery.includes('@') ? uriNoQuery.split('@')[1] : uriNoQuery.replace(/^mongodb(\+srv)?:\/\//, '');
    const hasDatabase = afterHost.includes('/');

    const connectString = hasDatabase ? rawUri : `${rawUri.replace(/\/$/, '')}/Edemy`;

    try {
        await mongoose.connect(connectString);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message || err);
        throw err;
    }
};

export default connectDB;