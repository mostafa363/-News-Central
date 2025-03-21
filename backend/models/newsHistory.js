import mongoose from "mongoose";

const NewsHistorySchema = new mongoose.Schema({
  userIp: { type: String, required: true }, // Stocker l'IP de l'utilisateur
  filters: { type: Object, required: true }, // Filtres utilisés pour récupérer l'article
  articles: { type: Array, required: true }, // Articles affichés
  timestamp: { type: Date, default: Date.now } // Date de la consultation
});

const NewsHistory = mongoose.model("NewsHistory", NewsHistorySchema);
export default NewsHistory;
