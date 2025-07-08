require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const http = require('http');
const socketIo = require('socket.io');
const { initializeCronJobs } = require('./scripts/collectiveWisdomCron');
const { integrateWithExpress } = require('./voice-server-integration');

// Set default JWT secret if not provided in .env
process.env.JWT_SECRET = process.env.JWT_SECRET || '970527706f7ab8f78eb2124e4d1ff30357235ee261d4d9d343be55d81c70ae067afb3b9b8ac7c83eeefa051a2208b59ba0a14ef9cab1af6c3156f4f968acc688';

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alterigo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  // Initialiser les jobs cron pour la sagesse collective
  initializeCronJobs();
})
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// API Routes
app.use('/api', routes);

// Intégration du système vocal WebSocket
try {
  const voiceSystem = integrateWithExpress(app, server);
  console.log('Voice system integrated successfully');
} catch (error) {
  console.error('Failed to integrate voice system:', error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.originalUrl);
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} and accessible from all network interfaces`);
});