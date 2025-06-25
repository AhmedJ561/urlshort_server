const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const url = require("./models/url");
const { connectToMongoDB } = require("./connect");

const port = process.env.PORT || 8000;
const app = express();

// Connect to MongoDB
connectToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Error connecting to MongoDB", err));

// CORS
app.use(
  cors({
    origin: "*", // You can restrict this later
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/url", urlRoute);
app.use("/server/home", staticRoute);

// Short ID redirect route
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await url.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  if (!entry) return res.status(404).send("Short URL not found");
  res.redirect(entry.redirectUrl);
});

// Serve static frontend
app.use(express.static(path.resolve(__dirname, "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
