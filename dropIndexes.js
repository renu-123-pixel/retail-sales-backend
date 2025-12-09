import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const drop = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Dropping indexes...");

  await mongoose.connection.db.collection("sales").dropIndexes();
  console.log("All indexes dropped!");

  process.exit(0);
};

drop();
