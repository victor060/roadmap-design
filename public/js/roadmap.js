let currentRoadmap = null;

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

// Botão voltar
document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = '/dashboard.html';
});

// Pega ID do roadmap da URL
function getRoadmapId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Carrega roadmap específico
async function loadRoadmap() {
    const roadmapId = getRoadmapId();
    
    if (!roadmapId) {
        window.location.href = '/dashboard.html';
        return;
    }
    
    try {
        const response = await fetch(`/api/roadmap/${roadmapId}`);
        const roadmap = await response.json();
        
        currentRoadmap = roadmap;
        renderRoadmapHeader(roadmap);
        renderSteps(roadmap.steps);
        updateProgress();
    } catch (error) {
        console.error('Erro ao carregar roadmap:', error);
        document.getElementById('roadmapHeader').innerHTML = 
            '<p class="error">Erro ao carregar roadmap. Tente novamente.</p>';
    }
}

// Renderiza cabeçalho do roadmap
function renderRoadmapHeader(roadmap) {
    const header = document.getElementById('roadmapHeader');
    const levelClass = roadmap.level.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    header.innerHTML = `
        <div class="icon">${roadmap.icon}</div>
        <h1>${roadmap.title}</h1>
        <p>${roadmap.description}</p>
        <div class="roadmap-meta">
            <div class="meta-item">
                <span>⏱️</span>
                <span>${roadmap.duration}</span>
            </div>
            <div class="meta-item">
                <span class="badge ${levelClass}">${roadmap.level}</span>
            </div>
            <div class="meta-item">
                <span>📚</span>
                <span>${roadmap.steps.length} etapas</span>
            </div>
        </div>
    `;
}

// Renderiza etapas
function renderSteps(steps) {
    const container = document.getElementById('stepsContainer');
    container.innerHTML = '';
    
    steps.forEach((step, index) => {
        const stepCard = createStepCard(step, index);
        container.appendChild(stepCard);
    });
}

// Cria card de etapa
function createStepCard(step, index) {
    const card = document.createElement('div');
    card.className = `step-card ${step.completed ? 'completed' : ''}`;
    card.id = `step-${step.id}`;
    
    const topicsHTML = step.topics.map(topic => 
        `<span class="topic-tag">${topic}</span>`
    ).join('');
    
    const resourcesHTML = step.resources.map(resource => 
        `<a href="#" class="resource-link" onclick="return false;">${resource}</a>`
    ).join('');
    
    card.innerHTML = `
        <div class="step-header">
            <div class="step-number">
                <div class="step-badge">${index + 1}</div>
                <h3 class="step-title">${step.title}</h3>
            </div>
            <div class="checkbox-wrapper">
                <input type="checkbox" 
                       id="checkbox-${step.id}" 
                       ${step.completed ? 'checked' : ''}
                       onchange="toggleStepCompletion(${step.id})">
            </div>
        </div>
        
        <p class="step-description">${step.description}</p>
        
        <div class="step-topics">
            <h4>📋 Tópicos abordados:</h4>
            <div class="topics-list">${topicsHTML}</div>
        </div>
        
        <div class="step-resources">
            <h4>🔗 Recursos recomendados:</h4>
            <div class="resources-list">${resourcesHTML}</div>
        </div>
        
        <span class="step-time">⏱️ ${step.estimatedTime}</span>
    `;
    
    return card;
}

// Toggle conclusão de etapa
function toggleStepCompletion(stepId) {
    const step = currentRoadmap.steps.find(s => s.id === stepId);
    if (step) {
        step.completed = !step.completed;
        
        const stepCard = document.getElementById(`step-${stepId}`);
        if (step.completed) {
            stepCard.classList.add('completed');
        } else {
            stepCard.classList.remove('completed');
        }
        
        updateProgress();
        saveProgress();
    }
}

// Atualiza barra de progresso
function updateProgress() {
    const totalSteps = currentRoadmap.steps.length;
    const completedSteps = currentRoadmap.steps.filter(s => s.completed).length;
    const percentage = Math.round((completedSteps / totalSteps) * 100);
    
    document.getElementById('progressFill').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = 
        `${percentage}% completo (${completedSteps}/${totalSteps} etapas)`;
}

// Salva progresso (simulado - em produção salvaria no backend)
function saveProgress() {
    const roadmapId = getRoadmapId();
    const progress = {
        roadmapId,
        steps: currentRoadmap.steps.map(s => ({
            id: s.id,
            completed: s.completed
        })),
        lastUpdate: new Date().toISOString()
    };
    
    // Salva no localStorage como exemplo
    localStorage.setItem(`progress_${roadmapId}`, JSON.stringify(progress));
    console.log('Progresso salvo:', progress);
}

// Carrega progresso salvo
function loadProgress() {
    const roadmapId = getRoadmapId();
    const savedProgress = localStorage.getItem(`progress_${roadmapId}`);
    
    if (savedProgress && currentRoadmap) {
        const progress = JSON.parse(savedProgress);
        
        progress.steps.forEach(saved => {
            const step = currentRoadmap.steps.find(s => s.id === saved.id);
            if (step) {
                step.completed = saved.completed;
            }
        });
        
        renderSteps(currentRoadmap.steps);
        updateProgress();
    }
}

// Inicializa página
(async () => {
    const authenticated = await checkAuth();
    if (authenticated) {
        await loadRoadmap();
        loadProgress();
    }
})();