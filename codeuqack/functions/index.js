const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

exports.analyzeFeedbackSentiment = functions.firestore
  .document("feedback/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
        {
          inputs: data.message
        },
        {
          headers: {
            Authorization: `Bearer ${functions.config().huggingface.key}`,
            "Content-Type": "application/json"
          }
        }
      );

      const label = response.data[0][0].label;

      let sentiment = "neutral";
      if (label === "POSITIVE") sentiment = "positive";
      if (label === "NEGATIVE") sentiment = "negative";

      return snap.ref.update({ sentiment });

    } catch (error) {
      console.error("AI Error:", error);
      return snap.ref.update({ sentiment: "neutral" });
    }
  });
