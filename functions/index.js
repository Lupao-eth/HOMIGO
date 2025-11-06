const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

exports.createPaymentLink = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { amount, description } = req.body;

      // ⚠️ Replace with your real PayMongo secret key
      const PAYMONGO_SECRET_KEY = "sk_test_okgSjEoq2U4iiPAAboYC4qay";

      const response = await axios.post(
        "https://api.paymongo.com/v1/links",
        {
          data: {
            attributes: {
              amount: amount * 100, // PHP → centavos
              description: description,
            },
          },
        },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ":").toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const paymentLink = response.data.data.attributes.checkout_url;
      res.status(200).send({ link: paymentLink });
    } catch (error) {
      console.error("Error creating payment link:", error.response?.data || error.message);
      res.status(500).send({ error: "Failed to create payment link" });
    }
  });
});
