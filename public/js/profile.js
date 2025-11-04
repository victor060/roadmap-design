// Verificar autenticação
async function checkAuth() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        window.location.href = '/index.html';
        return false;
    }
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
});

// Carregar perfil
async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        
        displayProfile(data.user);
        displayProgress(data.progress);
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

// Exibir dados do perfil
function displayProfile(user) {
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileBio').textContent = user.profile.bio || 'Sem biografia ainda...';
    document.getElementById('avatarDisplay').textContent = user.profile.avatar;
    document.getElementById('levelBadge').textContent = `Nível ${user.profile.level}`;
    
    document.getElementById('totalXP').textContent = user.profile.xp;
    document.getElementById('streakDays').textContent = user.profile.streak;
    document.getElementById('completedSteps').textContent = user.statistics.stepsCompleted;
    
    document.getElementById('roadmapsStarted').textContent = user.statistics.roadmapsStarted;
    document.getElementById('roadmapsCompleted').textContent = user.statistics.roadmapsCompleted;
    document.getElementById('studyTime').textContent = `${Math.floor(user.statistics.totalStudyTime / 60)}h`;
    
    const joinDate = new Date(user.statistics.joinedDate);
    document.getElementById('memberSince').textContent = joinDate.toLocaleDateString('pt-BR');
    
    // Preencher formulário
    document.getElementById('fullName').value = user.profile.fullName || '';
    document.getElementById('bio').value = user.profile.bio || '';
    document.getElementById('selectedAvatar').value = user.profile.avatar;
}

// Exibir progresso
function displayProgress(progressList) {
    const container = document.getElementById('progressList');
    
    if (progressList.length === 0) {
        container.innerHTML = '<p style="color: var(--gray);">Nenhum roadmap iniciado ainda.</p>';
        return;
    }
    
    const roadmaps = {
        1: { title: 'Desenvolvimento Web Frontend', icon: '🎨' },
        2: { title: 'Python para Data Science', icon: '🐍' },
        3: { title: 'Backend com Node.js', icon: '⚙️' }
    };
    
    container.innerHTML = progressList.map(progress => {
        const roadmap = roadmaps[progress.roadmapId];
        const completed = progress.steps.filter(s => s.completed).length;
        const total = progress.steps.length;
        const percentage = Math.round((completed / total) * 100);
        
        return `
            <div class="progress-card">
                <div class="progress-card-header">
                    <span class="progress-icon">${roadmap.icon}</span>
                    <div class="progress-card-info">
                        <h3>${roadmap.title}</h3>
                        <span class="progress-status ${progress.status}">${getStatusText(progress.status)}</span>
                    </div>
                </div>
                <div class="progress-bar-mini">
                    <div class="progress-fill-mini" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-card-footer">
                    <span>${completed}/${total} etapas</span>
                    <span>${percentage}%</span>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusText(status) {
    const statusMap = {
        'not_started': 'Não iniciado',
        'in_progress': 'Em andamento',
        'completed': 'Completo'
    };
    return statusMap[status] || status;
}

// Avatar picker
document.querySelectorAll('.avatar-option').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        document.getElementById('selectedAvatar').value = this.dataset.avatar;
        document.getElementById('avatarDisplay').textContent = this.dataset.avatar;
    });
});

// Editar perfil
document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const bio = document.getElementById('bio').value;
    const avatar = document.getElementById('selectedAvatar').value;
    
    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, bio, avatar })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('Perfil atualizado com sucesso!', 'success');
            displayProfile(data.user);
        } else {
            showMessage('Erro ao atualizar perfil', 'error');
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor', 'error');
    }
});

// Função auxiliar para mensagens
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    
    setTimeout(() => {
        message.className = 'message';
    }, 3000);
}

// Inicializar
(async () => {
    const authenticated = await checkAuth();
    if (authenticated) {
        await loadProfile();
    }
})();