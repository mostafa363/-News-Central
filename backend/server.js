import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js"; // Importation des routes des news

dotenv.config(); // Charger les variables d'environnement

const app = express();
app.use(express.json()); // Pour lire le JSON
app.use(cors()); // Autoriser les requêtes cross-origin

// Connexion à la base de données MongoDB
connectDB();

// Route test pour vérifier si le serveur fonctionne
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Intégration des routes pour la gestion des news
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
