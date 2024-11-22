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

    updateMissionList();
    createModal.classList.add("hidden");
    missionForm.reset();
});

// Atualizar a lista de missões
function updateMissionList() {
    missionList.innerHTML = "";
    missions.forEach((mission, index) => {
        const missionItem = document.createElement("div");
        missionItem.classList.add("mission-item");

        missionItem.innerHTML = `
            <h3>${mission.name}</h3>
            <p>${mission.description}</p>
            <p><strong>Dificuldade:</strong> ${mission.difficulty}</p>
            <p><strong>Heróis:</strong> ${mission.heroes.join(", ")}</p>
            <p><strong>Resultado:</strong> ${mission.result}</p>
            <p><strong>Recompensa:</strong> ${mission.reward}</p>
            <button class="edit-btn" data-index="${index}">Editar</button>
            <button class="delete-btn" data-index="${index}">Excluir</button>
        `;

        missionList.appendChild(missionItem);
    });

    // Adicionar eventos aos botões de editar e excluir
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", handleEditMission);
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", handleDeleteMission);
    });
}

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

// Inicializar
updateMissionList();
