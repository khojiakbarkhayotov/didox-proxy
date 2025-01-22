import dotenv from "dotenv";
import getSignature from "./createSignature.js";
import axios from "axios";
import createWebSocketConnection from "./socket.js";
dotenv.config();

const attachSignature = async (req) => {
  try {
    const response = await getSignature(req);

    const message = {
      pkcs7: response.key,
      signatureHex: response.signature,
    };

    const postResponse = await axios.post(
      "https://stage.goodsign.biz/v1/dsvs/timestamp",
      message,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("POST response: ", postResponse.data);
    const ws = createWebSocketConnection();
    return {
      token: postResponse.data.timeStampTokenB64,
    };
  } catch (err) {
    console.error("Error in attachSignature:", err);
    throw new Error(err.message);
  }
};

export default attachSignature;
