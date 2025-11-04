const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roadmapId: {
    type: Number,
    required: true
  },
  steps: [{
    stepId: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    timeSpent: { type: Number, default: 0 }, // em minutos
    notes: { type: String, default: '' }
  }],
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Índice composto para buscar progresso por usuário e roadmap
progressSchema.index({ user: 1, roadmapId: 1 }, { unique: true });

// Método para calcular porcentagem de conclusão
progressSchema.methods.getCompletionPercentage = function() {
  if (this.steps.length === 0) return 0;
  const completed = this.steps.filter(s => s.completed).length;
  return Math.round((completed / this.steps.length) * 100);
};

// Atualizar status automaticamente
progressSchema.pre('save', function(next) {
  const completedSteps = this.steps.filter(s => s.completed).length;
  
  if (completedSteps === 0) {
    this.status = 'not_started';
  } else if (completedSteps === this.steps.length) {
    this.status = 'completed';
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    this.status = 'in_progress';
  }
  
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);