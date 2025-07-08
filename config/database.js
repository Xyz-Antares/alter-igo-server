const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Using a local MongoDB instance
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alterigo';
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;