import mongoose from "mongoose";

let connected=false;
const connectDB = async () => {
  if(connected){
    console.log("Already connected to database");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    connected=true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    connected=false;
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
