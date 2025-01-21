import dotenv from 'dotenv';
import createWebSocketConnection from './socket.js';

dotenv.config();

const getListOfAllCertificates = () => {
  const message = {
    plugin: 'pfx',
    name: 'list_all_certificates',
  };

  const ws = createWebSocketConnection();

  ws.send(JSON.stringify(message));

  return new Promise((resolve, reject) => {
    console.log('\n\nSTEP 1 -> (List of certificates)(request)\n', message);

    const timeout = setTimeout(() => {
      console.error('WebSocket response timed out');
      reject(new Error('WebSocket response timed out'));
    }, 10000);

    ws.once('message', (data) => {
      clearTimeout(timeout); 

      try {
        const jsonMessage = JSON.parse(data.toString());
        console.log(`STEP 1 -> (List of certificates)(response)\n${data}`)
        if (jsonMessage.success) {
          resolve(jsonMessage.certificates); // Resolve the data
        } else {
          reject(new Error('Failed to fetch certificates'));
        }
      } catch (err) {
        reject(new Error('Invalid response format'));
      }
    });

    ws.once('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`WebSocket connection error: ${err.message}`));
    });
  });
};

export default getListOfAllCertificates;
