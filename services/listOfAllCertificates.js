import dotenv from 'dotenv';
import createWebSocketConnection from './socket.js';

dotenv.config();

const ws = createWebSocketConnection();

const getListOfAllCertificates = (res) => {
  const message = {
    plugin: 'pfx',
    name: 'list_all_certificates',
  };

  // Send the WebSocket message
  ws.send(JSON.stringify(message));

  // Listen for the WebSocket response
  ws.once('message', (data) => {
    const message = data.toString();
    console.log('Received message:', message);

    try {
      const jsonMessage = JSON.parse(message);

      if (jsonMessage.success) {
        // Send a successful response
        return res.status(200).json({ certificates: jsonMessage.certificates});
      } else {
        // Handle failure in the WebSocket response
        return res.status(400).json({ error: 'Failed to fetch certificates' });
      }
    } catch (err) {
      console.error('Error parsing message as JSON:', err.message);

      // Return an error response
      return res.status(500).json({ error: 'Internal Server Error!' });
    }
  });

  // Handle WebSocket errors
  ws.once('error', (err) => {
    console.error('WebSocket error:', err.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'WebSocket connection error' });
    }
  });

  // Handle WebSocket close event
  ws.once('close', () => {
    console.log('WebSocket connection closed');
  });
};

export default getListOfAllCertificates;
