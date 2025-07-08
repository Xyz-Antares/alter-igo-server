const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  tdc: {
    type: Number,
    default: 0, // Start at 0%
    min: 0,
    max: 100
  },
  tdcComponents: {
    engagement: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    communication: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    understanding: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    personalityMatch: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    progress: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    }
  },
  lastTdcUpdate: {
    type: Date,
    default: Date.now
  },
  personalityTraits: [{
    trait: String,
    score: Number,
    lastUpdated: Date
  }],
  traits: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  preferences: {
    language: {
      type: String,
      default: 'fr'
    },
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      messages: {
        type: Boolean,
        default: true
      },
      updates: {
        type: Boolean,
        default: true
      },
      recommendations: {
        type: Boolean,
        default: true
      }
    }
  },
  goals: [{
    description: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'abandoned'],
      default: 'pending'
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date
  }],
  detectedTraits: [{
    trait: String,
    detectedAt: Date,
    context: String
  }],
  conversations: [{
    id: String,
    title: String,
    messages: [{
      role: String,
      content: String,
      timestamp: Date
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    general: {
      autoSuggestions: { type: Boolean, default: true },
      soundNotifications: { type: Boolean, default: true }
    },
    language: {
      selected: { type: String, default: 'fr' }
    },
    notifications: {
      messages: { type: Boolean, default: true },
      updates: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true }
    },
    privacy: {
      analyzeConversations: { type: Boolean, default: true },
      shareAnonymousData: { type: Boolean, default: true }
    },
    theme: {
      mode: { type: String, default: 'light' }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isNew && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);