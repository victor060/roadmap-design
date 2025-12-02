require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function verUsuarios() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');
    
    const usuarios = await User.find().select('-password');
    
    console.log(`📊 Total de usuários: ${usuarios.length}\n`);
    console.log('=' .repeat(80));
    
    usuarios.forEach((user, index) => {
      console.log(`\n👤 Usuário ${index + 1}:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nome: ${user.profile.fullName || 'Não definido'}`);
      console.log(`   Avatar: ${user.profile.avatar}`);
      console.log(`   Nível: ${user.profile.level}`);
      console.log(`   XP: ${user.profile.xp}`);
      console.log(`   Sequência: ${user.profile.streak} dias`);
      console.log(`   Roadmaps iniciados: ${user.statistics.roadmapsStarted}`);
      console.log(`   Roadmaps completos: ${user.statistics.roadmapsCompleted}`);
      console.log(`   Etapas completadas: ${user.statistics.stepsCompleted}`);
      console.log(`   Cadastrado em: ${new Date(user.createdAt).toLocaleString('pt-BR')}`);
      console.log('-'.repeat(80));
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

verUsuarios();