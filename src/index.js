import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/index.js";
import { app } from "./app.js";


const port = process.env.PORT || 3000;

connectDB()
.then(() => {
  app.listen(port, () => {
    console.log("Server is live at ", port);
  })
})
.catch((err) => {
  console.log("MONGO DB CONNECTION FAILED", err);
  throw err;
}) 










/*
( async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
  } catch (error) {
    console.log("ERROR: ", error)
    throw err
  }
})()

*/