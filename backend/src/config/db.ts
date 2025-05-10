
import mongoose from 'mongoose';
const mongoURI = 'mongodb://localhost:27017/todoApp';
const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
export default connectMongoDB;
