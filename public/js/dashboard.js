// Verifica autenticação
async function checkAuth() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/index.html';
            return false;
        }
        
        document.getElementById('userName').textContent = `Olá, ${data.username}!`;
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

// Carrega roadmaps disponíveis
async function loadRoadmaps() {
    try {
        const response = await fetch('/api/roadmaps');
        const roadmaps = await response.json();
        
        const grid = document.getElementById('roadmapsGrid');
        grid.innerHTML = '';
        
        roadmaps.forEach(roadmap => {
            const card = createRoadmapCard(roadmap);
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar roadmaps:', error);
        document.getElementById('roadmapsGrid').innerHTML = 
            '<p class="error">Erro ao carregar roadmaps. Tente novamente.</p>';
    }
}

// Cria card de roadmap
function createRoadmapCard(roadmap) {
    const card = document.createElement('div');
    card.className = 'roadmap-card';
    card.onclick = () => selectRoadmap(roadmap.id);
    
    const levelClass = roadmap.level.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    card.innerHTML = `
        <div class="icon">${roadmap.icon}</div>
        <h3>${roadmap.title}</h3>
        <p>${roadmap.description}</p>
        <div class="roadmap-meta">
            <div class="meta-item">
                <span>⏱️</span>
                <span>${roadmap.duration}</span>
            </div>
            <div class="meta-item">
                <span class="badge ${levelClass}">${roadmap.level}</span>
            </div>
        </div>
        <div class="meta-item" style="margin-top: 12px;">
            <span>📚</span>
            <span>${roadmap.steps.length} etapas</span>
        </div>
    `;
    
    return card;
}

// Seleciona roadmap e redireciona
function selectRoadmap(roadmapId) {
    window.location.href = `/roadmap.html?id=${roadmapId}`;
}

// Inicializa página
(async () => {
    const authenticated = await checkAuth();
    if (authenticated) {
        await loadRoadmaps();
    }
})();