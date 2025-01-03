import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "/.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      throw new Error("Error in starting the server : " + error);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error in connecting to DB", error);
  });
