// /api/gcash.js
import axios from "axios";

// ✅ Function to set CORS headers
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ✅ Main handler
export default async function handler(req, res) {
  // Set CORS headers for every request
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, description } = req.body;

    // ✅ Ensure secret key is available
    const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
    if (!PAYMONGO_SECRET_KEY) {
      return res.status(500).json({ error: "Missing PayMongo Secret Key" });
    }

    // ✅ Create Base64 auth header (do NOT append your key again)
    const authHeader = Buffer.from(PAYMONGO_SECRET_KEY).toString("base64");

    // ✅ Send request to PayMongo
    const response = await axios.post(
      "https://api.paymongo.com/v1/sources",
      {
        data: {
          attributes: {
            amount: amount * 100, // Convert pesos to centavos
            description,
            type: "gcash",
            currency: "PHP",
            redirect: {
              success: "http://localhost:5173/success",
              failed: "http://localhost:5173/failed",
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

    // ✅ Extract checkout URL and send to frontend
    const payUrl = response.data.data.attributes.redirect.checkout_url;
    return res.status(200).json({ url: payUrl });

  } catch (err) {
    console.error("PayMongo Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Payment failed",
      details: err.response?.data || err.message,
    });
  }
}
