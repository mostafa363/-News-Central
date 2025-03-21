import express from "express";
import { fetchNews } from "../services/newsService.js";
import NewsHistory from "../models/newsHistory.js";

const router = express.Router();

// ✅ Route de test pour vérifier que l'API fonctionne
router.get("/", (req, res) => {
  res.send("News API is working!");
});

// 🔍 Route pour rechercher des articles selon les filtres
router.post("/search", async (req, res) => {
  try {
    const filters = req.body;
    const userIp = req.ip;

    console.log("🔍 Filters received:", filters);

    const articles = await fetchNews(filters);

    // Sauvegarder dans l'historique des recherches
    await NewsHistory.create({ userIp, filters, articles });

    res.json(articles);
  } catch (error) {
    console.error("❌ Error in search route:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 📜 Route pour récupérer l'historique des recherches de l'utilisateur
router.get("/history", async (req, res) => {
  try {
    const userIp = req.ip;
    const history = await NewsHistory.find({ userIp }).sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    console.error("❌ Error in history route:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
