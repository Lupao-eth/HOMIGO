// api/gcash.js
import axios from "axios";

export default async function handler(req, res) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://homigo-phc4oi3qb-poshis-projects-f8227a07.vercel.app",
    "https://homigo-5zji7touo-poshis-projects-f8227a07.vercel.app",
    "https://homigo-a1m67qgah-poshis-projects-f8227a07.vercel.app",
    "https://homigo-snowy.vercel.app",
  ];

  const origin = req.headers.origin;

  // ✅ Set CORS headers if origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { amount, description } = req.body;

      // Example: Call GCash / Paymongo API here
      // Replace with your actual payment integration
      const paymentResponse = await axios.post(
        "https://api.paymongo.com/v1/payments", // Example endpoint
        {
          data: {
            attributes: {
              amount,
              description,
              currency: "PHP",
              // Add other required fields here
            },
          },
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.PAYMONGO_SECRET_KEY + ":"
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Extract payment link (adjust depending on response)
      const url = paymentResponse.data?.data?.attributes?.redirect?.checkout_url || "https://example-payment-link.com";

      return res.status(200).json({ url });
    } catch (error) {
      console.error("GCash API error:", error.response?.data || error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
