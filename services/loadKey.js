import dotenv from "dotenv";
import createWebSocketConnection from "./socket.js";
import getListOfAllCertificates from "./listOfAllCertificates.js";
import { json } from "express";

dotenv.config();

const ws = createWebSocketConnection();

const getKey = async (req) => {
  var certificates = await getListOfAllCertificates();
  return new Promise((resolve, reject) => {
    try {
      var { alias, dataJson } = matchAlias(certificates, req.body);
    } catch (err) {
      reject(new Error(`Certificate not found!`));
    }

    const message = {
      plugin: "pfx",
      name: "load_key",
      arguments: [
        `${process.env.USER_DISK}`,
        `${process.env.USER_PATH}`,
        `${req.body.key}`,
        `${alias}`,
      ],
    };

    ws.send(JSON.stringify(message));

    console.log("\n\nSTEP 2 -> (Loading key)(request)\n", message);

    const timeout = setTimeout(() => {
      console.error("WebSocket response timed out");
      reject(new Error("WebSocket response timed out"));
    }, 10000);

    ws.once("message", (data) => {
      clearTimeout(timeout);
      try {
        const jsonMessage = JSON.parse(data.toString());
        console.log(`STEP 2 -> (Loading key)(response)\n${jsonMessage}`);
        if (jsonMessage.success) {
          resolve({ key: jsonMessage.keyId, data: dataJson });
        } else {
          reject(new Error(`${jsonMessage.reason}`));
        }
      } catch (err) {
        reject(new Error("Could not pass step 2"));
      }
    });

    ws.once("error", (err) => {
      clearTimeout(timeout);
      reject(new Error("Could not pass step 2"));
    });
  });
};

const matchAlias = (jsonList, body) => {
  for (const item of jsonList) {
    if (item.name == body.key) {
      if (body.json != null) {
        return { alias: item.alias, dataJson: body.json };
      }
      const match = item.alias.match(/1\.2\.860\.3\.16\.1\.1=([^\s,]+)/);
      const value = match ? match[1] : null;
      return { alias: item.alias, dataJson: value };
    }
  }
  throw new Error("not found");
};

export default getKey;
