const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const cors = require("cors");
const app = express();

// Connect to MongoDB with error handling
connectToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Use routes
app.use("/url", urlRoute);
app.use("/server/home", staticRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Vercel handler
const serverless = require("serverless-http");
module.exports = serverless(app);
