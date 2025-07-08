const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled', 'partial'],
    default: 'pending'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  dueDate: Date,
  completedAt: Date,
  notes: String,
  reminder: {
    enabled: { type: Boolean, default: false },
    time: Date
  }
});

const insightSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ['observation', 'suggestion', 'milestone', 'achievement', 'warning'],
    default: 'observation'
  },
  createdAt: { type: Date, default: Date.now }
});

const actionPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'emotional',
      'professional',
      'social',
      'health',
      'personal_growth',
      'habits',
      'communication',
      'stress_management',
      'other'
    ],
    default: 'personal_growth'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  actions: [actionSchema],
  relatedTraits: [{
    trait: String,
    category: String,
    impact: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'positive'
    }
  }],
  conversationContext: {
    conversationId: mongoose.Schema.Types.ObjectId,
    summary: String
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  insights: [insightSchema],
  metrics: {
    totalActions: { type: Number, default: 0 },
    completedActions: { type: Number, default: 0 },
    lastActivityDate: Date,
    estimatedCompletion: Date,
    streakDays: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Méthodes virtuelles et d'instance
actionPlanSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

actionPlanSchema.virtual('completionRate').get(function() {
  if (this.metrics.totalActions === 0) return 0;
  return Math.round((this.metrics.completedActions / this.metrics.totalActions) * 100);
});

// Mettre à jour automatiquement les métriques avant la sauvegarde
actionPlanSchema.pre('save', function(next) {
  // Calculer le nombre total d'actions
  this.metrics.totalActions = this.actions.length;
  
  // Calculer le nombre d'actions complétées
  this.metrics.completedActions = this.actions.filter(a => a.status === 'completed').length;
  
  // Calculer le pourcentage de progression (incluant les actions partielles)
  if (this.metrics.totalActions > 0) {
    const totalProgress = this.actions.reduce((sum, action) => {
      if (action.status === 'completed') {
        return sum + 100;
      } else if (action.status === 'partial') {
        return sum + (action.progress || 50);
      }
      return sum;
    }, 0);
    this.progress = Math.round(totalProgress / this.metrics.totalActions);
  } else {
    this.progress = 0;
  }
  
  // Mettre à jour la date de dernière activité
  this.metrics.lastActivityDate = new Date();
  
  // Mettre à jour le statut si toutes les actions sont complétées
  if (this.progress === 100 && this.status === 'active') {
    this.status = 'completed';
  }
  
  // Mettre à jour updatedAt
  this.updatedAt = new Date();
  
  next();
});

// Méthodes d'instance
actionPlanSchema.methods.addInsight = function(content, type = 'observation') {
  this.insights.push({ content, type });
};

actionPlanSchema.methods.getActiveActions = function() {
  return this.actions.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
};

actionPlanSchema.methods.getInProgressActions = function() {
  return this.actions.filter(a => a.status === 'in_progress' || a.status === 'partial');
};

actionPlanSchema.methods.getUpcomingReminders = function() {
  const now = new Date();
  return this.actions
    .filter(a => a.reminder && a.reminder.enabled && a.reminder.time > now)
    .map(a => ({
      actionId: a.id,
      actionTitle: a.title,
      planTitle: this.title,
      reminderTime: a.reminder.time
    }));
};

// Index pour améliorer les performances
actionPlanSchema.index({ userId: 1, status: 1 });
actionPlanSchema.index({ userId: 1, category: 1 });
actionPlanSchema.index({ userId: 1, createdAt: -1 });

const ActionPlan = mongoose.model('ActionPlan', actionPlanSchema);

module.exports = ActionPlan;