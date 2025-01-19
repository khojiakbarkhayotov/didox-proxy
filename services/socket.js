import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const webSocketIp = process.env.WEB_SOCKET_IP;

const wsUrl = `wss://${webSocketIp}/service/cryptapi`;
const wsOptions = {
  headers: {
    Host: webSocketIp,
    Origin: process.env.ORIGIN,
  },
  rejectUnauthorized: false,
};
var ws = null;

const createWebSocketConnection = () => {

  if (ws != null) {
    return ws;
  }

  ws = new WebSocket(wsUrl, wsOptions);

  ws.on('open', () => {
    console.log('Connected to WebSocket server');
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
  
  ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
    ws = null;
  });
  
  return ws;
};

export default createWebSocketConnection;
