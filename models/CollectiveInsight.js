const mongoose = require('mongoose');

const collectiveInsightSchema = new mongoose.Schema({
  // Contenu de l'insight
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  // Type d'insight
  type: {
    type: String,
    enum: ['reflection', 'advice', 'observation', 'motivation', 'wisdom'],
    required: true
  },
  // Catégorie thématique
  category: {
    type: String,
    enum: [
      'personal_growth',
      'relationships',
      'stress_management', 
      'productivity',
      'mindfulness',
      'communication',
      'leadership',
      'emotional_intelligence',
      'goals',
      'general'
    ],
    default: 'general'
  },
  // Contexte anonymisé de l'insight
  context: {
    type: String,
    maxlength: 500
  },
  // ID anonyme de l'utilisateur contributeur
  anonymousUserId: {
    type: String,
    required: true
  },
  // Statistiques de votes
  votes: {
    helpful: {
      type: Number,
      default: 0
    },
    inspiring: {
      type: Number,
      default: 0
    },
    relatable: {
      type: Number,
      default: 0
    }
  },
  // Liste des utilisateurs ayant voté (pour éviter les votes multiples)
  voters: [{
    userId: String,
    voteType: {
      type: String,
      enum: ['helpful', 'inspiring', 'relatable']
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Score de pertinence (calculé automatiquement)
  relevanceScore: {
    type: Number,
    default: 0
  },
  // Statut de modération
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'featured'],
    default: 'pending'
  },
  // Raison du rejet (si applicable)
  moderationNote: String,
  // Date de sélection comme "Pensée du jour"
  featuredDate: Date,
  // Nombre de fois où l'insight a été affiché
  viewCount: {
    type: Number,
    default: 0
  },
  // Tags pour faciliter la recherche
  tags: [String],
  // Traits de comportement associés
  associatedTraits: [{
    trait: String,
    relevance: {
      type: Number,
      min: 0,
      max: 1
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de recherche
collectiveInsightSchema.index({ relevanceScore: -1, status: 1 });
collectiveInsightSchema.index({ category: 1, type: 1 });
collectiveInsightSchema.index({ featuredDate: -1 });
collectiveInsightSchema.index({ createdAt: -1 });

// Méthode pour calculer le score de pertinence
collectiveInsightSchema.methods.calculateRelevanceScore = function() {
  const totalVotes = this.votes.helpful + this.votes.inspiring + this.votes.relatable;
  const viewRatio = this.viewCount > 0 ? totalVotes / this.viewCount : 0;
  const recencyBonus = Math.max(0, 30 - (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
  
  this.relevanceScore = (totalVotes * 0.7) + (viewRatio * 100 * 0.2) + (recencyBonus * 0.1);
  return this.relevanceScore;
};

// Méthode pour vérifier si un utilisateur a déjà voté
collectiveInsightSchema.methods.hasUserVoted = function(userId) {
  return this.voters.some(voter => voter.userId === userId);
};

module.exports = mongoose.model('CollectiveInsight', collectiveInsightSchema);