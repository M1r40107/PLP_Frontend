document.addEventListener('DOMContentLoaded', function() {
const hero1Select = document.getElementById('hero1-select');
const hero2Select = document.getElementById('hero2-select');
const hero1Info = document.getElementById('hero1-info');
const hero2Info = document.getElementById('hero2-info');
const hero1Image = document.getElementById('hero1-image');
const hero2Image = document.getElementById('hero2-image');
const simulateButton = document.getElementById('simulate-battle');
const battleResult = document.getElementById('battle-result');
const resultContent = document.getElementById('result-content');

// Carregar lista de heróis do backend
async function loadHeroes() {
    try {
        const response = await fetch('http://localhost:8080/');
        const heroes = await response.json();
        
        // Adicionar log para debug
        console.log('Heróis recebidos:', heroes);
        
        // Limpar as opções existentes
        hero1Select.innerHTML = '<option value="">Selecione um herói</option>';
        hero2Select.innerHTML = '<option value="">Selecione um herói</option>';
        
        // Preencher os selects com os heróis
        heroes.forEach(heroName => {
            // Agora esperamos que cada item do array seja diretamente o nome do herói
            if (heroName) {
                const option1 = new Option(heroName, heroName);
                const option2 = new Option(heroName, heroName);
                hero1Select.add(option1);
                hero2Select.add(option2);
            }
        });
    } catch (error) {
        console.error('Erro ao carregar heróis:', error);
    }
}

// Função para atualizar a imagem do herói
function updateHeroImage(heroName, imageElement) {
    const imagePath = `../images/${heroName.toLowerCase().replace(/ /g, "_")}.jpeg`;
    
    // Testa se a imagem existe
    const img = new Image();
    img.onerror = () => {
        // Se a imagem não existir, usa a imagem padrão
        imageElement.style.backgroundImage = `url('../images/default.jpeg')`;
    };
    img.onload = () => {
        // Se a imagem existir, usa ela
        imageElement.style.backgroundImage = `url('${imagePath}')`;
    };
    img.src = imagePath;
}

// Atualizar informações do herói selecionado
async function updateHeroInfo(heroName, infoElement, imageElement) {
    try {
        const response = await fetch('http://localhost:8080/heroi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome_heroi: heroName })
        });

        const heroData = await response.json();
        infoElement.innerHTML = `
            <div class="stat-box">
                <p><strong>Força:</strong> ${heroData.forca}</p>
                <p><strong>Popularidade:</strong> ${heroData.popularidade}</p>
                <p><strong>Status:</strong> ${heroData.status_atividade}</p>
            </div>
        `;

        // Atualizar a imagem do herói
        updateHeroImage(heroName, imageElement);
    } catch (error) {
        console.error('Erro ao carregar informações do herói:', error);
        infoElement.innerHTML = '<p class="error">Erro ao carregar informações</p>';
    }
}

// Simular batalha
async function simulateBattle() {
    const hero1 = hero1Select.value;
    const hero2 = hero2Select.value;

    if (!hero1 || !hero2) {
        alert('Selecione dois heróis para a batalha!');
        return;
    }

    if (hero1 === hero2) {
        alert('Selecione heróis diferentes!');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/simularbatalha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                heroi1: hero1,
                heroi2: hero2
            })
        });

        const result = await response.json();
        displayBattleResult(result);
    } catch (error) {
        console.error('Erro ao simular batalha:', error);
        alert('Erro ao simular batalha. Tente novamente.');
    }
}

// Exibir resultado da batalha
function displayBattleResult(result) {
    battleResult.classList.remove('hidden');
    
    resultContent.innerHTML = `
        <h3 class="winner">${result.vencedor} venceu a batalha!</h3>
        <div class="stat-box">
            <h4>${result.heroi1.nome}</h4>
            <p>Força Inicial: ${result.heroi1.forca_inicial}</p>
            <p>Força Final: ${result.heroi1.forca_final}</p>
            <p>Acerto Crítico: ${result.heroi1.acerto_critico ? 'Sim' : 'Não'}</p>
            <p>Moral na Luta: ${result.heroi1.moral_na_luta}</p>
        </div>
        <div class="stat-box">
            <h4>${result.heroi2.nome}</h4>
            <p>Força Inicial: ${result.heroi2.forca_inicial}</p>
            <p>Força Final: ${result.heroi2.forca_final}</p>
            <p>Acerto Crítico: ${result.heroi2.acerto_critico ? 'Sim' : 'Não'}</p>
            <p>Moral na Luta: ${result.heroi2.moral_na_luta}</p>
        </div>
    `;
}

// Event Listeners
hero1Select.addEventListener('change', () => {
    if (hero1Select.value) {
        updateHeroInfo(hero1Select.value, hero1Info, hero1Image);
    }
});

hero2Select.addEventListener('change', () => {
    if (hero2Select.value) {
        updateHeroInfo(hero2Select.value, hero2Info, hero2Image);
    }
});

simulateButton.addEventListener('click', simulateBattle);

// Carregar heróis ao iniciar a página
loadHeroes();
});