// /pages/api/gcash.js
import axios from "axios";

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://homigo-phc4oi3qb-poshis-projects-f8227a07.vercel.app",
];

// ✅ Helper: apply CORS headers
function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

// ✅ Main handler
export default async function handler(req, res) {
  applyCors(req, res);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, description } = req.body;

    // ✅ Use your secret key from environment
    const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
    if (!PAYMONGO_SECRET_KEY) {
      return res.status(500).json({ error: "Missing PayMongo Secret Key" });
    }

    // ✅ Basic auth encoding must include colon
    const authHeader = Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString("base64");

    // Determine redirect URLs based on origin
    const isLocal = req.headers.origin?.includes("localhost");
    const baseUrl = isLocal
      ? "http://localhost:5173"
      : "https://homigo-phc4oi3qb-poshis-projects-f8227a07.vercel.app";

    // ✅ Create GCash source on PayMongo
    const response = await axios.post(
      "https://api.paymongo.com/v1/sources",
      {
        data: {
          attributes: {
            amount: amount * 100, // convert PHP to centavos
            description,
            type: "gcash",
            currency: "PHP",
            redirect: {
              success: `${baseUrl}/success`,
              failed: `${baseUrl}/failed`,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Extract checkout URL and return
    const payUrl = response.data.data.attributes.redirect.checkout_url;
    return res.status(200).json({ link: payUrl });

  } catch (err) {
    console.error("PayMongo Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Payment failed",
      details: err.response?.data || err.message,
    });
  }
}
