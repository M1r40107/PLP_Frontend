const heroes = JSON.parse(localStorage.getItem("heroes")) || [];

const createHeroBtn = document.getElementById("create-hero-btn");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const entityForm = document.getElementById("entity-form");
const heroesCarousel = document.getElementById("heroes-carousel");

let editingHeroName = null;

function showModal() {
    createModal.classList.remove("hidden");
}

function closeModal() {
    createModal.classList.add("hidden");
    entityForm.reset();
    editingHeroName = null;
}

function saveHeroesToLocalStorage() {
    localStorage.setItem("heroes", JSON.stringify(heroes));
}

async function updateCarousel() {
    try {
        const response = await fetch("http://localhost:8080/");
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const heroes = await response.json();

        heroesCarousel.innerHTML = "";

        heroes.forEach((heroName, index) => {
            const card = document.createElement("div");
            card.classList.add("carousel-item");

            const imagePath = `assets/images/${heroName.toLowerCase().replace(/ /g, "_")}.jpg`;

            card.innerHTML = `
                <div class="hero-image1" style="background-image: url('${imagePath}')"></div>
                <h3>${heroName}</h3>
                <button class="view-btn" data-name="${heroName}">Ver</button>
                <button class="edit-btn" data-name="${heroName}">Editar</button>
                <button class="delete-btn" data-name="${heroName}">Excluir</button>
            `;
        
            heroesCarousel.appendChild(card);
        });

        // View Hero
        document.querySelectorAll(".view-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => viewHero(e.target.dataset.name))
        );

        // Edit Hero
        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => openEditModal(e.target.dataset.name))
        );

        // Delete Hero
        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => deleteHero(e.target.dataset.name)) // Usando data-name para capturar o nome
        );

    } catch (error) {
        console.error("Erro ao atualizar o carrossel:", error);
    }
}
async function viewHero(heroName) {
    try {
        console.log("Enviando nome do herói:", heroName);

        const response = await fetch("http://localhost:8080/heroi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome_heroi: heroName }),
        });

        console.log("Status da resposta:", response.status);

        if (!response.ok) {
            throw new Error(`Erro ao buscar informações do herói: ${response.statusText}`);
        }

        const heroDetails = await response.json();
        console.log("Detalhes do herói recebidos:", heroDetails);

        alert(`
            Nome de Herói: ${heroDetails.nome_heroi}
            Nome Real: ${heroDetails.nome_real}
            Sexo: ${heroDetails.sexo}
            Peso: ${heroDetails.peso} kg
            Altura: ${heroDetails.altura} m
            Data de Nascimento: ${new Date(heroDetails.data_nascimento).toLocaleDateString()}
            Local de Nascimento: ${heroDetails.local_nascimento}
            Popularidade: ${heroDetails.popularidade}%
            Status de Atividade: ${heroDetails.status_atividade}
            Força: ${heroDetails.forca}
            Poderes: ${heroDetails.poder.length > 0 ? heroDetails.poder.join(", ") : "Nenhum"}
        `);
    } catch (error) {
        console.error("Erro ao buscar detalhes do herói:", error);
        alert("Não foi possível carregar as informações do herói.");
    }
}
async function deleteHero(heroName) {
    try {
        console.log(JSON.stringify({ nome_heroi: heroName }));
        console.log("Nome do herói a ser excluído:", heroName);

        const response = await fetch("http://localhost:8080/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome_heroi: heroName }), // Envia o nome do herói para ser excluído
        });

        if (!response.ok) {
            throw new Error(`Erro ao excluir o herói: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Herói excluído com sucesso:", result);

        // Atualiza o carrossel após a exclusão
        updateCarousel();
    } catch (error) {
        console.error("Erro ao excluir o herói:", error);
        alert("Não foi possível excluir o herói.");
    }
}

async function openEditModal(heroName) {
    try {
        console.log("Nome do herói enviado:", heroName);

        const response = await fetch("http://localhost:8080/heroi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome_heroi: heroName }),
        });

        console.log("Resposta da API:", response);

        if (!response.ok) {
            throw new Error(`Erro ao buscar informações do herói: ${response.statusText}`);
        }

        const hero = await response.json();
        console.log("Dados do herói recebidos:", hero);

        // Preencher o formulário com os dados recebidos
        document.getElementById("entity-name").value = hero.nome_heroi || "";
        document.getElementById("entity-real-name").value = hero.nome_real || "";
        document.getElementById("entity-sex").value = hero.sexo || "";
        document.getElementById("entity-height").value = hero.altura || "";
        document.getElementById("entity-weight").value = hero.peso || "";
        document.getElementById("entity-local").value = hero.local_nascimento || "";
        document.getElementById("entity-birth").value = hero.data_nascimento
            ? new Date(hero.data_nascimento).toISOString().split("T")[0]
            : "";

        editingHeroName = hero.nome_heroi; // Nome do herói sendo editado

        // Mostrar o modal de edição
        showModal();
    } catch (error) {
        console.error("Erro ao buscar dados do herói:", error);
        alert("Não foi possível carregar os dados do herói para edição.");
    }
}


async function saveHeroChanges() {
    const name = document.getElementById("entity-name").value;
    const realName = document.getElementById("entity-real-name").value;
    const sex = document.getElementById("entity-sex").value;
    const height = parseFloat(document.getElementById("entity-height").value);  // Certifique-se de que o valor é um número
    const weight = parseFloat(document.getElementById("entity-weight").value);  // Certifique-se de que o valor é um número
    const birth = document.getElementById("entity-birth").value; // Data no formato YYYY-MM-DD
    const local = document.getElementById("entity-local").value;
    const popularity = parseInt(document.getElementById("entity-popularity").value, 10);  // Convertendo para número inteiro
    const strength = parseInt(document.getElementById("entity-strength").value, 10);  // Convertendo para número inteiro
    const status = document.getElementById("entity-status").value;

    // Função para converter o formato de data YYYY-MM-DD para YYYY-MM-DDTHH:mm:ssZ
    const convertDateToISO8601 = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${year}-${month}-${day}T00:00:00Z`;  // ISO 8601 com hora e fuso horário UTC
    };

    // Converte a data de nascimento para o formato ISO 8601
    const formattedBirthDate = convertDateToISO8601(birth);

    const heroData = {
        nome_heroi: name,
        heroi_atualizado: {
            nome_heroi: realName,
            nome_real: realName,
            sexo: sex,
            altura: height,
            peso: weight,
            data_nascimento: formattedBirthDate, // Agora com o formato ISO 8601
            local_nascimento: local,
            popularidade: popularity,
            forca: strength,
            status_atividade: status,
        }
    };

    try {
        console.log(JSON.stringify(heroData))
        const response = await fetch('http://localhost:8080/editar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(heroData),  // Envia os dados no corpo da requisição
        });

        if (!response.ok) {
            throw new Error(`Erro ao salvar alterações do herói: ${response.statusText}`);
        }

        const result = await response.json();
        alert('Heroi atualizado com sucesso!');
        console.log(result);

    } catch (error) {
        console.error('Erro ao salvar alterações do herói:', error);
        alert('Não foi possível salvar as alterações do herói.');
    }
}




entityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveHeroChanges();
});

createHeroBtn.addEventListener("click", () => {
    window.location.href = "cadastro/cadastro.html";
});

closeModalBtn.addEventListener("click", closeModal);

updateCarousel();
