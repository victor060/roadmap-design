require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/database');
const User = require('./models/User');
const Progress = require('./models/Progress');
const Achievement = require('./models/Achievement');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
connectDB();

// Inicializar conquistas
Achievement.initializeAchievements();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Função auxiliar para ler roadmaps
const getRoadmaps = () => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'roadmaps.json'), 'utf8');
  return JSON.parse(data);
};

// ===== ROTAS DE AUTENTICAÇÃO =====

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Senha incorreta' });
    }
    
    req.session.userId = user._id;
    req.session.username = user.username;
    
    res.json({ success: true, username: user.username });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Registro
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verifica se usuário já existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário ou email já cadastrado' 
      });
    }
    
    // Cria novo usuário
    const user = new User({ username, email, password });
    await user.save();
    
    res.json({ success: true, message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Verificar sessão
app.get('/api/check-session', async (req, res) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('-password');
      res.json({ 
        authenticated: true, 
        username: user.username,
        user: user
      });
    } catch (error) {
      res.json({ authenticated: false });
    }
  } else {
    res.json({ authenticated: false });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ===== ROTAS DE ROADMAPS =====

// Listar roadmaps
app.get('/api/roadmaps', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  const roadmaps = getRoadmaps();
  res.json(roadmaps);
});

// Obter roadmap específico
app.get('/api/roadmap/:id', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  try {
    const roadmaps = getRoadmaps();
    const roadmap = roadmaps.find(r => r.id === parseInt(req.params.id));
    
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap não encontrado' });
    }
    
    // Buscar progresso do usuário
    const progress = await Progress.findOne({
      user: req.session.userId,
      roadmapId: roadmap.id
    });
    
    // Se não existe progresso, criar um novo
    if (!progress) {
      const newProgress = new Progress({
        user: req.session.userId,
        roadmapId: roadmap.id,
        steps: roadmap.steps.map(step => ({
          stepId: step.id,
          completed: false
        }))
      });
      await newProgress.save();
      
      // Atualizar estatísticas do usuário
      await User.findByIdAndUpdate(req.session.userId, {
        $inc: { 'statistics.roadmapsStarted': 1 }
      });
    }
    
    // Mesclar dados do roadmap com progresso
    if (progress) {
      roadmap.steps = roadmap.steps.map(step => {
        const stepProgress = progress.steps.find(s => s.stepId === step.id);
        return {
          ...step,
          completed: stepProgress ? stepProgress.completed : false,
          notes: stepProgress ? stepProgress.notes : ''
        };
      });
    }
    
    res.json(roadmap);
  } catch (error) {
    console.error('Erro ao buscar roadmap:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Atualizar progresso de uma etapa
app.post('/api/roadmap/:roadmapId/step/:stepId', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  try {
    const { roadmapId, stepId } = req.params;
    const { completed } = req.body;
    
    const progress = await Progress.findOne({
      user: req.session.userId,
      roadmapId: parseInt(roadmapId)
    });
    
    if (!progress) {
      return res.status(404).json({ error: 'Progresso não encontrado' });
    }
    
    // Atualizar etapa
    const stepIndex = progress.steps.findIndex(s => s.stepId === parseInt(stepId));
    if (stepIndex !== -1) {
      progress.steps[stepIndex].completed = completed;
      if (completed) {
        progress.steps[stepIndex].completedAt = new Date();
        
        // Adicionar XP ao usuário
        const user = await User.findById(req.session.userId);
        user.addXP(20);
        await user.save();
      }
    }
    
    await progress.save();
    
    // Verificar conquistas
    await checkAchievements(req.session.userId);
    
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// ===== ROTAS DE PERFIL =====

// Obter perfil do usuário
app.get('/api/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  try {
    const user = await User.findById(req.session.userId)
      .select('-password')
      .populate('achievements');
    
    const allProgress = await Progress.find({ user: req.session.userId });
    
    res.json({ user, progress: allProgress });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Atualizar perfil
app.put('/api/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  try {
    const { fullName, bio, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        'profile.fullName': fullName,
        'profile.bio': bio,
        'profile.avatar': avatar
      },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// ===== ROTAS DE CONQUISTAS =====

// Listar todas as conquistas
app.get('/api/achievements', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  
  try {
    const allAchievements = await Achievement.find();
    const user = await User.findById(req.session.userId).populate('achievements');
    
    const achievementsWithStatus = allAchievements.map(ach => ({
      ...ach.toObject(),
      unlocked: user.achievements.some(userAch => userAch._id.equals(ach._id))
    }));
    
    res.json(achievementsWithStatus);
  } catch (error) {
    console.error('Erro ao buscar conquistas:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Função auxiliar para verificar conquistas
async function checkAchievements(userId) {
  try {
    const user = await User.findById(userId).populate('achievements');
    const allProgress = await Progress.find({ user: userId });
    const allAchievements = await Achievement.find();
    
    const stepsCompleted = user.statistics.stepsCompleted;
    const roadmapsCompleted = user.statistics.roadmapsCompleted;
    const streak = user.profile.streak;
    
    for (const achievement of allAchievements) {
      // Verificar se já foi desbloqueada
      if (user.achievements.some(a => a._id.equals(achievement._id))) {
        continue;
      }
      
      let unlock = false;
      
      switch (achievement.category) {
        case 'steps':
          unlock = stepsCompleted >= achievement.requirement;
          break;
        case 'roadmaps':
          unlock = roadmapsCompleted >= achievement.requirement;
          break;
        case 'streak':
          unlock = streak >= achievement.requirement;
          break;
      }
      
      if (unlock) {
        user.achievements.push(achievement._id);
        user.addXP(achievement.xpReward);
      }
    }
    
    await user.save();
  } catch (error) {
    console.error('Erro ao verificar conquistas:', error);
  }
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Acesse http://localhost:${PORT}/index.html`);
});