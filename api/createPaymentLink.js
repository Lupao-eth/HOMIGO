// /api/createPaymentLink.js
import axios from "axios";

// ✅ Helper: Set CORS headers
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  // Always set CORS
  setCorsHeaders(res);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { amount, description } = req.body;

    // ✅ Ensure PayMongo key exists
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: "Missing PayMongo Secret Key" });
    }

    // ✅ PayMongo payload
    const payload = {
      data: {
        attributes: {
          amount: amount * 100, // Convert pesos to centavos
          description,
          payment_method_allowed: ["gcash"],
          currency: "PHP",
          capture_type: "automatic",
          payment_method_options: {
            gcash: {
              success_url: "http://localhost:5173/success",
              failure_url: "http://localhost:5173/failed",
            },
          },
        },
      },
    };

    // ✅ Correct PayMongo endpoint
    const response = await axios.post(
      "https://api.paymongo.com/v1/links",
      payload,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(secretKey).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ Return checkout URL to frontend
    const checkoutUrl = response.data.data.attributes.checkout_url;
    return res.status(200).json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error("PayMongo Error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Payment creation failed",
      error: error.response?.data || error.message,
    });
  }
}
