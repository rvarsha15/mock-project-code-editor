{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const http = require('http');\
const WebSocket = require('ws');\
const \{ GoogleGenerativeAI \} = require('@google/generative-ai');\
const Y = require('yjs');\
const \{ WebsocketProvider \} = require('y-websocket');\
\
const app = express();\
const server = http.createServer(app);\
const wss = new WebSocket.Server(\{ server \});\
\
app.use(express.json());\
\
// Gemini API setup\
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);\
\
// Store rooms and documents\
const rooms = new Map();\
\
wss.on('connection', (ws, req) => \{\
  const url = new URL(req.url, `http://$\{req.headers.host\}`);\
  const roomId = url.searchParams.get('room');\
\
  if (!roomId) \{\
    ws.close();\
    return;\
  \}\
\
  let doc = rooms.get(roomId);\
  if (!doc) \{\
    doc = new Y.Doc();\
    rooms.set(roomId, doc);\
  \}\
\
  const provider = new WebsocketProvider(\
    'ws://localhost:3001',\
    roomId,\
    doc,\
    \{ WebSocketPolyfill: WebSocket \}\
  );\
\
  ws.on('close', () => \{\
    provider.disconnect();\
    if (provider.wsconnected === false) \{\
      rooms.delete(roomId);\
    \}\
  \});\
\});\
\
app.post('/api/complete', async (req, res) => \{\
  try \{\
    const \{ context \} = req.body;\
    const model = genAI.getGenerativeModel(\{ model: 'gemini-pro' \});\
    const result = await model.generateContent(context);\
    const response = await result.response;\
    const text = response.text();\
\
    res.json(\{ suggestions\
}