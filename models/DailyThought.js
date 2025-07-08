const mongoose = require('mongoose');

const dailyThoughtSchema = new mongoose.Schema({
  // Référence à l'insight collectif sélectionné
  insightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectiveInsight',
    required: true
  },
  // Date du jour pour cette pensée
  date: {
    type: Date,
    required: true,
    unique: true
  },
  // Thème du jour (optionnel)
  theme: {
    type: String,
    maxlength: 100
  },
  // Statistiques d'engagement
  engagement: {
    views: {
      type: Number,
      default: 0
    },
    reactions: {
      love: { type: Number, default: 0 },
      inspired: { type: Number, default: 0 },
      thoughtful: { type: Number, default: 0 },
      grateful: { type: Number, default: 0 }
    },
    shares: {
      type: Number,
      default: 0
    }
  },
  // Utilisateurs ayant réagi (pour éviter les réactions multiples)
  userReactions: [{
    userId: String,
    reactionType: {
      type: String,
      enum: ['love', 'inspired', 'thoughtful', 'grateful']
    },
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Commentaires de réflexion des utilisateurs
  reflections: [{
    userId: String,
    anonymousId: String,
    content: {
      type: String,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isAnonymous: {
      type: Boolean,
      default: true
    }
  }],
  // Metadata
  metadata: {
    // Critères de sélection utilisés
    selectionCriteria: {
      scoreThreshold: Number,
      categoryFocus: String,
      traitAlignment: [String]
    },
    // Performance de la pensée du jour
    performanceScore: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les requêtes fréquentes
dailyThoughtSchema.index({ date: -1 });
dailyThoughtSchema.index({ 'engagement.views': -1 });

// Méthode pour vérifier si un utilisateur a déjà réagi
dailyThoughtSchema.methods.hasUserReacted = function(userId) {
  return this.userReactions.some(reaction => reaction.userId === userId);
};

// Méthode pour calculer le score de performance
dailyThoughtSchema.methods.calculatePerformanceScore = function() {
  const totalReactions = Object.values(this.engagement.reactions).reduce((a, b) => a + b, 0);
  const engagementRate = this.engagement.views > 0 ? 
    (totalReactions + this.reflections.length) / this.engagement.views : 0;
  
  this.metadata.performanceScore = engagementRate * 100;
  return this.metadata.performanceScore;
};

module.exports = mongoose.model('DailyThought', dailyThoughtSchema);