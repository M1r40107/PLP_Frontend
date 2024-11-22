const missions = [];
const missionList = document.getElementById("mission-list");
const createMissionBtn = document.getElementById("create-mission-btn");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const missionForm = document.getElementById("mission-form");
let editingMissionIndex = null; // Para identificar se estamos editando uma missão

// Mostrar o modal de criação
createMissionBtn.addEventListener("click", () => {
    createModal.classList.remove("hidden");
    missionForm.reset(); // Limpar formulário
    editingMissionIndex = null; // Garantir que não está editando
});

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
            <p><strong>Recompensa:</strong> ${mission.recompensa || 'A definir'}</p>
            <button class="edit-btn" data-id="${mission.id_missao}">Editar</button>
            <button class="delete-btn" data-id="${mission.id_missao}">Excluir</button>
        `;

        missionList.appendChild(missionItem);
    });

    // Adicionar eventos aos botões
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", handleEditMission);
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", handleDeleteMission);
    });
}

// Adicionar ou editar missão
missionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("mission-name").value;
    const description = document.getElementById("mission-description").value;
    const difficulty = parseInt(document.getElementById("mission-difficulty").value);
    const heroes = document.getElementById("mission-heroes").value.split(",");
    const result = document.getElementById("mission-result").value;

    const reward = result === "success" ? "Força +1 / Popularidade +5" : "Força -1 / Popularidade -5";

    const missionData = { name, description, difficulty, heroes, result, reward };

    if (editingMissionIndex !== null) {
        // Editar missão existente
        missions[editingMissionIndex] = missionData;
        editingMissionIndex = null;
    } else {
        // Adicionar nova missão
        missions.push(missionData);
    }

    createModal.classList.add("hidden");
    missionForm.reset();
});



// Editar missão
function handleEditMission(event) {
    const index = event.target.dataset.index;
    const mission = missions[index];

    // Preencher o formulário com os dados da missão
    document.getElementById("mission-name").value = mission.name;
    document.getElementById("mission-description").value = mission.description;
    document.getElementById("mission-difficulty").value = mission.difficulty;
    document.getElementById("mission-heroes").value = mission.heroes.join(", ");
    document.getElementById("mission-result").value = mission.result;

    editingMissionIndex = index; // Salvar índice para edição
    createModal.classList.remove("hidden");
}

// Excluir missão
function handleDeleteMission(event) {
    const index = event.target.dataset.index;

    // Confirmar exclusão
    if (confirm("Tem certeza que deseja excluir esta missão?")) {
        missions.splice(index, 1); // Remover missão
        updateMissionList(); // Atualizar lista
    }
}
