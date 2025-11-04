let allAchievements = [];
let currentFilter = 'all';

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

// Carregar conquistas
async function loadAchievements() {
    try {
        const response = await fetch('/api/achievements');
        allAchievements = await response.json();
        
        updateSummary();
        displayAchievements();
    } catch (error) {
        console.error('Erro ao carregar conquistas:', error);
        document.getElementById('achievementsList').innerHTML = 
            '<p style="color: var(--danger);">Erro ao carregar conquistas. Tente novamente.</p>';
    }
}

// Atualizar resumo
function updateSummary() {
    const unlocked = allAchievements.filter(a => a.unlocked).length;
    const total = allAchievements.length;
    const percentage = Math.round((unlocked / total) * 100);
    
    document.getElementById('unlockedCount').textContent = unlocked;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('progressPercent').textContent = `${percentage}%`;
}

// Exibir conquistas
function displayAchievements() {
    const container = document.getElementById('achievementsList');
    
    let filtered = allAchievements;
    if (currentFilter !== 'all') {
        filtered = allAchievements.filter(a => a.category === currentFilter);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="color: var(--gray);">Nenhuma conquista nesta categoria.</p>';
        return;
    }
    
    container.innerHTML = filtered.map(achievement => {
        const rarityClass = achievement.rarity;
        const unlockedClass = achievement.unlocked ? 'unlocked' : 'locked';
        
        return `
            <div class="achievement-card ${rarityClass} ${unlockedClass}">
                <div class="achievement-icon">${achievement.unlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-details">
                    <h3 class="achievement-title">${achievement.title}</h3>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-footer">
                        <span class="achievement-rarity ${rarityClass}">${getRarityText(achievement.rarity)}</span>
                        <span class="achievement-xp">+${achievement.xpReward} XP</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Texto de raridade
function getRarityText(rarity) {
    const rarityMap = {
        'common': 'Comum',
        'rare': 'Rara',
        'epic': 'Épica',
        'legendary': 'Lendária'
    };
    return rarityMap[rarity] || rarity;
}

// Filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        displayAchievements();
    });
});

// Inicializar
(async () => {
    const authenticated = await checkAuth();
    if (authenticated) {
        await loadAchievements();
    }
})();