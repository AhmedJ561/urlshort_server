const { nanoid } = require('nanoid');
const Url = require('../models/url'); // ✅ Correct model import

async function handleNewGenerateShortUrl(req, res) {
  if (!req.body || !req.body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortId = nanoid(8);
  try {
    const newUrl = await Url.create({
      shortId: shortId,
      redirectUrl: req.body.url, // ✅ Ensure field name matches schema
      visitHistory: [],
    });

    return res.json({ id: newUrl.shortId });
  } catch (error) {
    console.error("Error creating URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleNewGenerateShortUrl,
};
