const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Log incoming requests (for debugging)
router.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});

// Authentication routes
router.use('/auth', require('./auth'));

// Admin routes
router.use('/admin', require('./admin'));

// Chat routes (protected by auth middleware)
router.post('/chat', auth, (req, res, next) => {
  console.log('Chat request body:', req.body);
  chatController.processMessage(req, res, next);
});

// Conversations routes
router.use('/conversations', require('./conversations'));

// AI routes
router.use('/ai', require('./ai'));

// Settings routes
router.use('/settings', require('./settings'));

// TDC routes
router.use('/tdc', require('./tdc'));

// Users routes
router.use('/users', require('./users'));

// Transcription routes
router.use('/transcribe', require('./transcription'));

// Action Plans routes
router.use('/', require('./actionPlanRoutes'));

// Analytics routes
router.use('/', require('./analyticsRoutes'));

// Collective Wisdom routes
router.use('/collective', require('./collectiveInsight'));

// Voice Session routes (nouveau système vocal temps réel)
router.use('/voice', require('./voiceSession'));

// TTS routes (synthèse vocale Piper)
router.use('/tts', require('./tts'));

// Export the router
module.exports = router;