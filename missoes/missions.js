const missions = [];
const missionList = document.getElementById("mission-list");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const missionForm = document.getElementById("mission-form");
let editingMissionIndex = null; // Para identificar se estamos editando uma missão


// Fechar o modal
closeModalBtn.addEventListener("click", () => {
    createModal.classList.add("hidden");
});


async function loadMissions() {
    try {
        console.log("Iniciando requisição para /missoes..."); // Debug
        const response = await fetch('http://localhost:8080/missoes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log("Status da resposta:", response.status); // Debug

        if (!response.ok) {
            throw new Error(`Erro ao carregar missões: ${response.status}`);
        }

        const missionsData = await response.json();
        console.log("Dados recebidos:", missionsData); // Debug

        if (!Array.isArray(missionsData)) {
            console.error("Dados recebidos não são um array:", missionsData);
            return;
        }

        updateMissionList(missionsData);
    } catch (error) {
        console.error('Erro detalhado ao carregar missões:', error);
        alert('Não foi possível carregar as missões.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página carregada, iniciando carregamento de missões..."); // Debug
    loadMissions();
});

// Modificar a função updateMissionList para usar os dados do backend
function updateMissionList(missions) {
    missionList.innerHTML = "";
    missions.forEach((mission) => {
        const missionItem = document.createElement("div");
        missionItem.classList.add("mission-item");

        missionItem.innerHTML = `
            <h3>${mission.nome_missao}</h3>
            <p>${mission.descricao}</p>
            <p><strong>Dificuldade:</strong> ${mission.nivel_dificuldade}</p>
            <p><strong>Herói:</strong> ${mission.nome_heroi}</p>
            <p><strong>Resultado:</strong> ${mission.resultado || 'Pendente'}</p>
            <div class="mission-actions">
                <button class="edit-btn" data-id="${mission.id_missao}">Editar</button>
                <button class="delete-btn" data-id2="${mission.id_missao}">Excluir</button>
            </div>
        `;

        // Adicionar event listeners para os botões
        const editBtn = missionItem.querySelector('.edit-btn');
        const deleteBtn = missionItem.querySelector('.delete-btn'); // Adicionar esta linha
        editBtn.addEventListener('click', handleEditMission);
        deleteBtn.addEventListener('click', handleDeleteMission);

        missionList.appendChild(missionItem);
    });
}

// Editar missão
async function handleEditMission(event) {
    const missionId = event.target.getAttribute('data-id');
    if (!missionId) {
        console.error('ID da missão não encontrado');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/missao/${missionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erro ao buscar dados da missão');

        const mission = await response.json();

        // Preencher o formulário
        document.getElementById("mission-name").value = mission.nome_missao;
        document.getElementById("mission-description").value = mission.descricao;
        document.getElementById("mission-difficulty").value = mission.nivel_dificuldade;
        document.getElementById("mission-result").value = mission.resultado;
        document.getElementById("mission-heroes").value = mission.nome_heroi || '';

        // Configurar o formulário para edição
        const form = document.getElementById("mission-form");
        form.dataset.editingId = missionId;
        
        // Atualizar título do modal
        document.querySelector(".modal-content h2").textContent = "Editar Missão";
        
        // Mostrar modal
        createModal.classList.remove("hidden");
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados da missão');
    }
}

// Editar missão
async function handleDeleteMission(event) {
    const missionId = event.target.getAttribute('data-id2');
    if (!missionId) {
        console.error('ID da missão não encontrado');
        return;
    }

    if (!confirm('Tem certeza que deseja excluir esta missão?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/missao/${missionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erro ao excluir a missão');

        // Recarregar a lista de missões após excluir
        await loadMissions();
        alert('Missão excluída com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir a missão');
    }
}

// Modificar o evento de submit do formulário
missionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const missionId = missionForm.dataset.editingId;
    
    // Se não houver ID de edição, não prossegue
    if (!missionId) {
        alert('Operação inválida: ID da missão não encontrado');
        return;
    }

    const missionData = {
        nome_missao: document.getElementById("mission-name").value,
        descricao: document.getElementById("mission-description").value,
        nivel_dificuldade: document.getElementById("mission-difficulty").value,
        resultado: document.getElementById("mission-result").value,
        nome_heroi: document.getElementById("mission-heroes").value
    };

    try {
        const response = await fetch(`http://localhost:8080/missao/${missionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(missionData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao atualizar missão: ${response.status} - ${errorText}`);
        }

        // Limpar o formulário e fechar o modal
        missionForm.reset();
        missionForm.dataset.editingId = '';
        createModal.classList.add("hidden");
        
        // Atualizar a lista de missões
        await loadMissions();
        
        alert('Missão atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar missão:', error);
        alert(`Erro ao atualizar missão: ${error.message}`);
    }
});