#  Guia de Instalação - Roadmap Alunos 

##  Pré-requisitos

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **MongoDB** (versão 4.4 ou superior)
   - Download: https://www.mongodb.com/try/download/community

---

Para verificar:
```bash
mongod --version
```

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

##  Rodando o Projeto

### 1. Inicie o MongoDB
Certifique-se de que o MongoDB está rodando:

**Windows:** (já deve estar rodando como serviço)
```bash
# Verificar status
sc query MongoDB
```

### 2. Inicie o servidor

Modo produção:
```bash
npm start
```
###
3. Acesse a aplicação

Abra o navegador e vá para:
```
http://localhost:3000/index.html
```

---

##  Primeiro Acesso

1. Clique em "Cadastro"
2. Crie uma conta com:
   - Usuário (mínimo 3 caracteres)
   - Email válido
   - Senha (mínimo 6 caracteres)
3. Faça login com suas credenciais
4. Explore os roadmaps!


---
