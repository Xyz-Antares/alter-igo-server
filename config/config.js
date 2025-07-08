module.exports = {
  // Secret pour la génération et la validation des JWT
  jwtSecret: process.env.JWT_SECRET || 'alter-igo-secret-key',
  
  // Durée de validité du token JWT (en secondes)
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // URL de l'API LLM (LM Studio pour Qwen 2.5 14B local)
  llmApiUrl: process.env.LLM_API_URL || 'http://192.168.1.12:1234/v1',
  
  // Clé API LLM (peut être n'importe quoi pour LM Studio)
  llmApiKey: process.env.LLM_API_KEY || 'lm-studio',
  
  // Modèle LLM à utiliser (Qwen 2.5 14B via LM Studio)
  llmModel: process.env.LLM_MODEL || 'qwen2.5-14b',
  
  // Configuration OpenAI de fallback (en cas de problème avec le LLM local)
  openai: {
    apiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    enabled: process.env.OPENAI_FALLBACK_ENABLED === 'true' || false
  },
  
  // Port du serveur
  port: process.env.PORT || 3001,
  
  // URL de MongoDB
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/alter-igo',
  
  // Environnement (development, production, test)
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Origine CORS autorisée
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Configuration des logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  
  // Paramètres de l'analyse comportementale
  behavioralAnalysis: {
    enabled: process.env.ENABLE_BEHAVIORAL_ANALYSIS === 'true' || true,
    minMessagesForAnalysis: parseInt(process.env.MIN_MESSAGES_FOR_ANALYSIS, 10) || 3,
  },
  
  // Paramètres de génération de titre
  titleGeneration: {
    enabled: process.env.ENABLE_TITLE_GENERATION === 'true' || true,
    minMessagesForTitle: parseInt(process.env.MIN_MESSAGES_FOR_TITLE, 10) || 2,
  },
};