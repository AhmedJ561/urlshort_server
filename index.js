require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const cors = require("cors");
const Url = require("./models/url");
const app = express();

const corsOptions = {
  origin: [
    "https://ahmedj561.github.io",

    "https://urlshort-server.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
// Do not process.exit(1) on Vercel/serverless environments as it will crash the function.
connectToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/url", urlRoute);
app.use("/server/home", staticRoute);

app.get("/", (req, res) => {
  res.status(200).send("URL Shortener API is running");
});

app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await Url.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );

    if (entry) {
      res.redirect(entry.redirectUrl);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error occurred while redirecting:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).send('Something broke!');
});

// For Vercel Serverless Function, export the Express app directly
module.exports = app;
