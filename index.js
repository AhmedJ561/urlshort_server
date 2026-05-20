const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: [
        "https://ahmedj561.github.io", 
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).send('Something broke!');
});

// For Vercel Serverless Function, export the Express app directly
module.exports = app;
