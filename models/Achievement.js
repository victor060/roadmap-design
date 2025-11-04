const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['steps', 'roadmaps', 'streak', 'social', 'special'],
    required: true
  },
  requirement: {
    type: Number,
    required: true
  },
  xpReward: {
    type: Number,
    default: 50
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Conquistas predefinidas
const defaultAchievements = [
  {
    code: 'FIRST_STEP',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira etapa',
    icon: '🎯',
    category: 'steps',
    requirement: 1,
    xpReward: 10,
    rarity: 'common'
  },
  {
    code: 'SPEED_LEARNER',
    title: 'Aprendiz Veloz',
    description: 'Complete 5 etapas em um dia',
    icon: '⚡',
    category: 'steps',
    requirement: 5,
    xpReward: 50,
    rarity: 'rare'
  },
  {
    code: 'DEDICATION',
    title: 'Dedicação',
    description: 'Complete 10 etapas',
    icon: '💪',
    category: 'steps',
    requirement: 10,
    xpReward: 30,
    rarity: 'common'
  },
  {
    code: 'MASTER',
    title: 'Mestre',
    description: 'Complete 50 etapas',
    icon: '👑',
    category: 'steps',
    requirement: 50,
    xpReward: 100,
    rarity: 'epic'
  },
  {
    code: 'ROADMAP_STARTER',
    title: 'Iniciante da Jornada',
    description: 'Inicie seu primeiro roadmap',
    icon: '🚀',
    category: 'roadmaps',
    requirement: 1,
    xpReward: 20,
    rarity: 'common'
  },
  {
    code: 'ROADMAP_FINISHER',
    title: 'Finalizador',
    description: 'Complete seu primeiro roadmap',
    icon: '🎓',
    category: 'roadmaps',
    requirement: 1,
    xpReward: 100,
    rarity: 'rare'
  },
  {
    code: 'POLYMATH',
    title: 'Polímata',
    description: 'Complete 3 roadmaps diferentes',
    icon: '🧠',
    category: 'roadmaps',
    requirement: 3,
    xpReward: 200,
    rarity: 'epic'
  },
  {
    code: 'STREAK_3',
    title: 'Consistência',
    description: 'Mantenha 3 dias de estudo consecutivos',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    xpReward: 30,
    rarity: 'common'
  },
  {
    code: 'STREAK_7',
    title: 'Semana Perfeita',
    description: 'Mantenha 7 dias de estudo consecutivos',
    icon: '⭐',
    category: 'streak',
    requirement: 7,
    xpReward: 70,
    rarity: 'rare'
  },
  {
    code: 'STREAK_30',
    title: 'Mestre da Disciplina',
    description: 'Mantenha 30 dias de estudo consecutivos',
    icon: '💎',
    category: 'streak',
    requirement: 30,
    xpReward: 300,
    rarity: 'legendary'
  },
  {
    code: 'EARLY_BIRD',
    title: 'Madrugador',
    description: 'Estude antes das 8h da manhã',
    icon: '🌅',
    category: 'special',
    requirement: 1,
    xpReward: 20,
    rarity: 'rare'
  },
  {
    code: 'NIGHT_OWL',
    title: 'Coruja Noturna',
    description: 'Estude depois das 23h',
    icon: '🦉',
    category: 'special',
    requirement: 1,
    xpReward: 20,
    rarity: 'rare'
  }
];

// Função para inicializar conquistas
achievementSchema.statics.initializeAchievements = async function() {
  for (const achievement of defaultAchievements) {
    await this.findOneAndUpdate(
      { code: achievement.code },
      achievement,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Conquistas inicializadas!');
};

module.exports = mongoose.model('Achievement', achievementSchema);