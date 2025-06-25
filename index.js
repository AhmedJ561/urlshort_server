const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("../routes/url");
const staticRoute = require("../routes/staticRouter");
const cors = require("cors");
const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

connectToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/url", urlRoute);
app.use("/server/home", staticRoute);

// Vercel handler
const serverless = require("serverless-http");
module.exports = serverless(app);
