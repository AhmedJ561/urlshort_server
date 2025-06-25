const express = require("express");
const URL = require("../models/url");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allURLs = await URL.find({}); // ✅ Await the DB query
    return res.render("home", { urls: allURLs }); // ✅ Use `urls`
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
