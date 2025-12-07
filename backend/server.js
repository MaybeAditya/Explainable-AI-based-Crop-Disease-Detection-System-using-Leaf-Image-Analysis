require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL_URL = "https://router.huggingface.co/hf-inference/models/wambugu71/crop_leaf_diseases_vit";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });


app.get("/", (req, res) => {
  res.send("🌿 Plant Disease Detector Backend is Running!");
});

app.post("/predict", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const imagePath = path.join(__dirname, req.file.path);
  const imageBuffer = fs.readFileSync(imagePath);

  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: imageBuffer,
    });
    if (!response.ok) {
      const errorText = await response.text(); // Read the HTML response
      console.error("🚨 HUGGING FACE API ERROR:", errorText); // Print it to the terminal
      throw new Error(`API Request Failed: ${response.status}`);
    }
    const result = await response.json();
    fs.unlinkSync(imagePath);

    if (!Array.isArray(result) || result.length === 0) {
      console.error("Invalid model response:", result);
      return res
        .status(500)
        .json({ error: "Model inference failed", details: result });
    }

    const topPrediction = result[0];
    res.json({
      prediction: topPrediction.label,
      confidence: (topPrediction.score * 100).toFixed(2),
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Error connecting to Hugging Face" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
