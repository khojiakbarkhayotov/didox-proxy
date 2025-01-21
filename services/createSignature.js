import dotenv from 'dotenv';
import createWebSocketConnection from './socket.js';
import getKey from './loadKey.js'

dotenv.config();

const ws = createWebSocketConnection();

const getSignature = async (req) => {
  var response = await getKey(req);

  const message = {
    plugin: "pkcs7",
    name: "create_pkcs7",
    arguments: [
        `${btoa(response.data)}`,
        `${response.key}`,
        "no"
    ]
    };

    ws.send(JSON.stringify(message));

    return new Promise((resolve, reject) => {
        console.log('\n\nSTEP 3 -> (Creating signature)(request)\n', message);
        ws.once('message', (data) => {
    
          try {
            const jsonMessage = JSON.parse(data.toString());
            console.log('STEP 3 -> (Creating signature)(response)\n', jsonMessage);
            if (jsonMessage.success) {
                ws.close();
              resolve({key: jsonMessage.pkcs7_64, signature: jsonMessage.signature_hex, serialNumber: jsonMessage.signer_serial_number});
            } else {
              reject(new Error(jsonMessage?.reason));
            }
          } catch (err) {
            reject("Cannot create signature");
          }
        });
    
        ws.once('error', (err) => {
          clearTimeout(timeout);
          reject("Cannot create signature");
        });
      });
};

export default getSignature;
