import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

const newsAPI = process.env.NEWS_API_KEY;
const nytAPI = process.env.NYT_API_KEY;
const gnewsAPI = process.env.GNEWS_API_KEY;

// Création d'une instance Axios pour chaque API
const axiosInstances = {
  newsapi: axios.create({ baseURL: "https://newsapi.org/v2" }),
  nytimes: axios.create({ baseURL: "https://api.nytimes.com/svc/search/v2" }),
  gnews: axios.create({ baseURL: "https://gnews.io/api/v4" })
};

// Fonction pour récupérer les articles des trois sources
export const fetchNews = async (filters) => {
  try {
    const { keyword, category, from, to } = filters;

    const requests = [
      axiosInstances.newsapi.get("/everything", {
        params: {
          q: keyword,
          from,
          to,
          category,
          apiKey: newsAPI
        }
      }),
      axiosInstances.nytimes.get("/articlesearch.json", {
        params: {
          q: keyword,
          begin_date: from ? from.replace(/-/g, "") : undefined,
          end_date: to ? to.replace(/-/g, "") : undefined,
          fq: category ? `news_desk:("${category}")` : undefined,
          "api-key": nytAPI
        }
      }),
      axiosInstances.gnews.get("/search", {
        params: {
          q: keyword,
          from,
          to,
          category,
          token: gnewsAPI
        }
      })
    ];

    // Exécuter toutes les requêtes en parallèle
    const responses = await Promise.allSettled(requests);

    // Filtrer les résultats valides et extraire les articles
    const results = responses
      .filter(res => res.status === "fulfilled" && res.value.data.articles)
      .flatMap(res => res.value.data.articles || []);

    return results;
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
    return [];
  }
};
