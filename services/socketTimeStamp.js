import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const webSocketIp = process.env.WEB_SOCKET_IP;
const wsUrl = `wss://${webSocketIp}/v1/dsvs/timestamp`;
const wsOptions = {
  headers: {
    Host: webSocketIp,
    Origin: process.env.ORIGIN,
  },
  rejectUnauthorized: false,
};
let ws = null;

const createWebSocket = (customWsUrl = wsUrl) => {
  // Close the existing connection if one exists
  if (ws !== null) {
    return ws;
  }

  // Create a new WebSocket connection
  ws = new WebSocket(customWsUrl, wsOptions);

  ws.on('open', () => {
    console.log('Connected to WebSocket timestamp server');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
    // Check if it's a 404 error, then attempt to reconnect with a different URL or handle accordingly
    if (err.message.includes('Unexpected server response: 404')) {
      console.log('404 error occurred, attempting to reconnect with a different URL...');
      // You can change to a different URL or retry the current URL
      createWebSocket(); // Recursively attempt connection
    }
  });

  ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
    ws = null;
  });

  return ws;
};

export default createWebSocket;
