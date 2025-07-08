# Alter IGO Server

Backend server for Alter IGO AI Coach - A personal life coach application with psychological analysis capabilities.

## 🚀 Features

- **AI-Powered Coaching**: Integration with Claude 3.5 Sonnet for intelligent conversations
- **Psychological Analysis**: 689-trait TDC (Tendance de Développement de Carrière) system
- **Action Plans**: Goal setting and progress tracking
- **Voice Integration**: Real-time transcription and text-to-speech capabilities
- **Collective Wisdom**: Community insights and anonymous sharing
- **Real-time Communication**: WebSocket support for live interactions

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Xyz-Antares/alter-igo-server.git
cd alter-igo-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Anthropic API key for Claude
   - MongoDB connection string
   - JWT secret
   - Deepgram API key (for voice transcription)

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `PORT`: Server port (default: 3001)
- `DEEPGRAM_API_KEY`: For voice transcription services

See `.env.example` for all configuration options.

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat & Conversations
- `POST /api/chat/process` - Process chat messages
- `GET /api/conversations/:userId` - Get user conversations
- `POST /api/conversations/:userId` - Create new conversation

### Action Plans
- `POST /api/users/:userId/action-plans` - Create action plan
- `GET /api/users/:userId/action-plans` - Get user's action plans
- `PUT /api/action-plans/:planId/actions/:actionId` - Update action

### TDC Analysis
- `GET /api/users/:userId/tdc` - Get TDC analysis
- `POST /api/users/:userId/tdc/update` - Update TDC traits

### Voice Services
- WebSocket endpoint for real-time voice processing
- Text-to-speech streaming
- Voice transcription

## 🏗️ Architecture

### Core Components

- **Express Server**: Main application server
- **MongoDB + Mongoose**: Data persistence
- **Socket.io**: Real-time communication
- **Claude AI**: Intelligent conversation processing
- **Deepgram**: Voice transcription
- **JWT**: Authentication

### Directory Structure

```
server/
├── controllers/     # Request handlers
├── models/         # MongoDB schemas
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Express middleware
├── scripts/        # Utility scripts
└── utils/          # Helper functions
```

## 🔒 Security

- JWT-based authentication
- Rate limiting on sensitive endpoints
- CORS configuration
- Input validation
- Secure password hashing with bcrypt

## 🧪 Development

### Running Scripts

Various utility scripts are available in the `scripts/` directory:

- `createTestUser.js` - Create test users
- `listUsers.js` - List all users
- `showUserTdc.js` - Display user TDC analysis
- `collectiveWisdomCron.js` - Collective wisdom processing

### Testing

```bash
npm test
```

## 🚀 Deployment

The server is configured for deployment with:
- Environment variable support
- Production-ready error handling
- Scalable architecture

For production deployment:
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Use proper API keys
4. Set up SSL/TLS

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

For contributing guidelines, please contact the project maintainers.

## 📞 Support

For support and questions, please open an issue in the repository.