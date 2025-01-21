import attachSignature from '../services/attachSignature.js';

const getTokenController = async (req, res) => {
  try {
    const sign = await attachSignature(req);

    if (sign == null) {
      return res.status(400).json({ error: "Signature is null or invalid" });
    }

    try {
      res.status(200).json({ sign });
    } catch (parseError) {
      console.error("Failed to parse sign as JSON:", parseError.message);
      res.status(400).json({ error: sign });
    }
  } catch (error) {
    console.error("Error in getTokenController:", error.message);
    res.status(500).json({ error: error.message }); 
  }
};

export default getTokenController;
