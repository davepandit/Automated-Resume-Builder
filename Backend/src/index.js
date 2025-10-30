import app from "./app.js";
import { connectDB } from "./db/index.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
  });
});
