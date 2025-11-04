# 🚀 Guia de Instalação - Roadmap Alunos v2.0

## 📦 Pré-requisitos

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **MongoDB** (versão 4.4 ou superior)
   - Download: https://www.mongodb.com/try/download/community

3. **VSCode** (recomendado)
   - Download: https://code.visualstudio.com/

---

## 🗄️ Instalando o MongoDB

### Windows:
1. Baixe o instalador MSI do MongoDB
2. Execute o instalador com as opções padrão
3. Certifique-se de marcar "Install MongoDB as a Service"
4. Após instalação, o MongoDB iniciará automaticamente

Para verificar:
```bash
mongod --version
```

### macOS (com Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
sudo apt-get install gnupg
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

---

## 🔧 Configuração do Projeto

### 1. Clone ou crie a estrutura do projeto

```bash
mkdir roadmap-alunos
cd roadmap-alunos
```

### 2. Crie todos os arquivos necessários

Estrutura completa:
```
roadmap-alunos/
├── .env
├── .gitignore
├── package.json
├── server.js
├── config/
│   └── database.js
├── models/
│   ├── User.js
│   ├── Progress.js
│   └── Achievement.js
├── data/
│   └── roadmaps.json
└── public/
    ├── index.html
    ├── dashboard.html
    ├── roadmap.html
    ├── profile.html
    ├── achievements.html
    ├── css/
    │   └── style.css
    └── js/
        ├── login.js
        ├── dashboard.js
        ├── roadmap.js
        ├── profile.js
        └── achievements.js
```

### 3. Instale as dependências

```bash
npm install
```

Isso instalará:
- express
- express-session
- body-parser
- mongoose
- bcryptjs
- dotenv

### 4. Configure o arquivo .env

Certifique-se de que o `.env` está configurado:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/roadmap-alunos
SESSION_SECRET=roadmap-secret-key-super-secure-2024
BCRYPT_ROUNDS=10
```

---

## ▶️ Rodando o Projeto

### 1. Inicie o MongoDB
Certifique-se de que o MongoDB está rodando:

**Windows:** (já deve estar rodando como serviço)
```bash
# Verificar status
sc query MongoDB
```

**macOS/Linux:**
```bash
# Verificar se está rodando
sudo systemctl status mongod

# Se não estiver, iniciar
sudo systemctl start mongod
```

### 2. Inicie o servidor

Modo produção:
```bash
npm start
```

Modo desenvolvimento (reinicia automaticamente):
```bash
npm run dev
```

### 3. Acesse a aplicação

Abra o navegador e vá para:
```
http://localhost:3000/index.html
```

---

## 👤 Primeiro Acesso

1. Clique em "Cadastro"
2. Crie uma conta com:
   - Usuário (mínimo 3 caracteres)
   - Email válido
   - Senha (mínimo 6 caracteres)
3. Faça login com suas credenciais
4. Explore os roadmaps!

---

## 🎯 Funcionalidades Disponíveis

### ✅ Sistema de Autenticação
- Cadastro de usuários
- Login seguro com bcrypt
- Sessões persistentes

### ✅ Roadmaps Interativos
- 3 roadmaps completos (Frontend, Python, Backend)
- Marcar etapas como concluídas
- Barra de progresso em tempo real
- Progresso salvo no banco de dados

### ✅ Sistema de Perfil
- Editar nome, biografia e avatar
- Visualizar estatísticas detalhadas
- Acompanhar progresso em todos os roadmaps
- Sistema de níveis e XP

### ✅ Conquistas Gamificadas
- 12 conquistas diferentes
- 4 níveis de raridade (Comum, Rara, Épica, Lendária)
- Recompensas em XP
- Filtros por categoria

### ✅ Sistema de XP e Níveis
- +20 XP por etapa completada
- XP bônus por conquistas
- Níveis calculados automaticamente (1 nível = 100 XP)

---

## 🔧 Solução de Problemas

### MongoDB não conecta:
```bash
# Verifique se o MongoDB está rodando
sudo systemctl status mongod

# Reinicie o MongoDB
sudo systemctl restart mongod
```

### Porta 3000 já em uso:
Altere a porta no arquivo `.env`:
```env
PORT=3001
```

### Erro "Cannot find module":
Reinstale as dependências:
```bash
rm -rf node_modules
npm install
```

### Sessão expira muito rápido:
No `server.js`, aumente o tempo do cookie:
```javascript
cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 dias
```

---

## 📊 Visualizando o Banco de Dados

### Instalar MongoDB Compass (GUI):
Download: https://www.mongodb.com/try/download/compass

Conecte-se em: `mongodb://localhost:27017`

### Ou via linha de comando:
```bash
mongosh
use roadmap-alunos
db.users.find()
db.progresses.find()
db.achievements.find()
```

---

## 🚀 Próximos Passos (Futuras Melhorias)

- [ ] Upload de foto de perfil real
- [ ] Exportar progresso em PDF
- [ ] Fórum/comunidade de alunos
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Compartilhar conquistas nas redes sociais
- [ ] Ranking de usuários
- [ ] Roadmaps personalizáveis
- [ ] Integração com calendário
- [ ] App mobile

---

## 📝 Notas Importantes

1. **Segurança:** Em produção, use variáveis de ambiente seguras e HTTPS
2. **Backup:** Configure backups regulares do MongoDB
3. **Performance:** Considere adicionar índices no MongoDB para queries frequentes
4. **Escalabilidade:** Para muitos usuários, considere MongoDB Atlas (cloud)

---

## 🤝 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor no terminal
2. Verifique o console do navegador (F12)
3. Certifique-se de que todos os arquivos foram criados
4. Confirme que o MongoDB está rodando

---
