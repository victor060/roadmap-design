// Gerenciamento de tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const formContents = document.querySelectorAll('.form-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        // Remove active de todos
        tabButtons.forEach(b => b.classList.remove('active'));
        formContents.forEach(f => f.classList.remove('active'));
        
        // Adiciona active no clicado
        btn.classList.add('active');
        document.getElementById(`${targetTab}Form`).classList.add('active');
        
        // Limpa mensagem
        hideMessage();
    });
});

// Formulário de Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Erro ao fazer login', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

// Formulário de Cadastro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Cadastro realizado! Faça login para continuar.', 'success');
            // Limpa formulário
            e.target.reset();
            // Muda para tab de login após 2 segundos
            setTimeout(() => {
                document.querySelector('[data-tab="login"]').click();
            }, 2000);
        } else {
            showMessage(data.message || 'Erro ao cadastrar', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

// Funções auxiliares
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
}

function hideMessage() {
    const message = document.getElementById('message');
    message.className = 'message';
}

// Verifica se já está logado
async function checkSession() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (data.authenticated) {
            window.location.href = '/dashboard.html';
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
    }
}

checkSession();