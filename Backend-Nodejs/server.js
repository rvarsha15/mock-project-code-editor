const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store rooms and documents
const rooms = new Map();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const roomId = url.searchParams.get('room');

  if (!roomId) {
    ws.close();
    return;
  }

  let doc = rooms.get(roomId);
  if (!doc) {
    doc = new Y.Doc();
    rooms.set(roomId, doc);
  }

  const provider = new WebsocketProvider(
    'ws://localhost:3001',
    roomId,
    doc,
    { WebSocketPolyfill: WebSocket }
  );

  ws.on('close', () => {
    provider.disconnect();
    if (provider.wsconnected === false) {
      rooms.delete(roomId);
    }
  });
});

app.post('/api/complete', async (req, res) => {
  try {
    const { context } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(context);
    const response = await result
