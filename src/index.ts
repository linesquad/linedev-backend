import dotenv from "dotenv";
dotenv.config();

import app from "./server";

import connectDB from "./config/db";

const PORT = process.env.PORT || 8000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
};

startServer();
