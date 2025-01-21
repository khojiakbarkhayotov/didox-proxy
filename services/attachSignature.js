import dotenv from "dotenv";
import getSignature from "./createSignature.js";
import axios from "axios";  // Add axios for making HTTP requests
dotenv.config();

const attachSignature = async (req) => {
  try {
    // Step 1: Get the signature
    const response = await getSignature(req);

    // Step 2: Prepare the payload for the POST request
    const message = {
      pkcs7: response.key, // Value of the pkcs7_64 field
      signatureHex: response.signature, // Value of the signature_hex field
    };

    // Step 3: Send the POST request
    const postResponse = await axios.post(
      "https://stage.goodsign.biz/v1/dsvs/timestamp",
      message,
      {
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );

    // Step 4: Handle the response
    console.log("POST response: ", postResponse.data);

    // Resolve with the relevant information (token or any other response data)
    return {
      token: postResponse.data.timeStampTokenB64, // Assuming the token is returned in this field
    };
  } catch (err) {
    console.error("Error in attachSignature:", err);
    throw new Error("Failed to attach signature");
  }
};

export default attachSignature;
