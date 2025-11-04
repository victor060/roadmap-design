const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    fullName: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '👤' },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  statistics: {
    roadmapsStarted: { type: Number, default: 0 },
    roadmapsCompleted: { type: Number, default: 0 },
    stepsCompleted: { type: Number, default: 0 },
    totalStudyTime: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para calcular level baseado em XP
userSchema.methods.calculateLevel = function() {
  return Math.floor(this.profile.xp / 100) + 1;
};

// Atualizar level automaticamente
userSchema.methods.addXP = function(xp) {
  this.profile.xp += xp;
  this.profile.level = this.calculateLevel();
};

module.exports = mongoose.model('User', userSchema);