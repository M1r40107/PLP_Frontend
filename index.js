const heroes = JSON.parse(localStorage.getItem("heroes")) || [];

const createHeroBtn = document.getElementById("create-hero-btn");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const entityForm = document.getElementById("entity-form");
const heroesCarousel = document.getElementById("heroes-carousel");

let editingIndex = null;

function showModal() {
    createModal.classList.remove("hidden");
}

function closeModal() {
    createModal.classList.add("hidden");
    entityForm.reset();
    editingIndex = null;
}

function saveHeroesToLocalStorage() {
    localStorage.setItem("heroes", JSON.stringify(heroes));
}

async function updateCarousel() {
    try {
        // Faz a requisição para o backend na rota "/"
        const response = await fetch("http://localhost:8080/");
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        
        // Obtém os dados dos heróis como uma lista de nomes
        const heroes = await response.json();

        // Limpa o conteúdo do carrossel
        heroesCarousel.innerHTML = ""; 

        // Adiciona os heróis ao carrossel
        heroes.forEach((heroName, index) => {
            const card = document.createElement("div");
            card.classList.add("carousel-item");

            // Define a imagem com base no nome do herói
            const imagePath = `assets/images/${heroName.toLowerCase().replace(/ /g, "_")}.jpg`;

            card.innerHTML = `
                <div class="hero-image1" style="background-image: url('${imagePath}')"></div>
                <h3>${heroName}</h3>
                <button class="view-btn" data-id="${index}">Ver</button>
                <button class="edit-btn" data-id="${index}">Editar</button>
                <button class="delete-btn" data-id="${index}">Excluir</button>
            `;
            heroesCarousel.appendChild(card);
        });

        // Adiciona os event listeners para os botões
        document.querySelectorAll(".view-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => viewHero(e.target.dataset.id))
        );

        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => editHero(e.target.dataset.id))
        );

        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => deleteHero(e.target.dataset.id))
        );

    } catch (error) {
        console.error("Erro ao atualizar o carrossel:", error);
    }
}

async function viewHero(index) {
    try {
        // Obtém o nome do herói clicado
        const heroName = heroes[index].name; // Use .name para acessar o nome do herói
        console.log("Enviando nome do herói:", heroName);

        // Faz a requisição para a API
        const response = await fetch("http://localhost:8080/heroi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome_heroi: heroName }),
        });

        console.log("Status da resposta:", response.status);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao buscar informações do herói: ${response.statusText}`);
        }

        // Extrai os dados do herói da resposta JSON
        const heroDetails = await response.json();
        console.log("Detalhes do herói recebidos:", heroDetails);

        // Exibe os detalhes do herói em um alert
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

function editHero(index) {
    const hero = heroes[index];
    editingIndex = index;

    document.getElementById("entity-name").value = hero.name;
    document.getElementById("entity-real-name").value = hero.realName;
    document.getElementById("entity-sex").value = hero.sex;
    document.getElementById("entity-height").value = hero.height;
    document.getElementById("entity-weight").value = hero.weight;
    document.getElementById("entity-local").value = hero.local;
    document.getElementById("entity-birth").value = hero.birth;

    showModal();
}

function deleteHero(index) {
    const hero = heroes[index];
    const confirmDelete = confirm(`Deseja realmente excluir "${hero.name}"?`);
    if (confirmDelete) {
        heroes.splice(index, 1);
        saveHeroesToLocalStorage();
        updateCarousel();
    }
}

entityForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("entity-name").value;
    const realName = document.getElementById("entity-real-name").value;
    const sex = document.getElementById("entity-sex").value;
    const height = document.getElementById("entity-height").value;
    const weight = document.getElementById("entity-weight").value;
    const local = document.getElementById("entity-local").value;
    const birth = document.getElementById("entity-birth").value;
    const imageFile = document.getElementById("entity-image").files[0];

    if (editingIndex !== null) {
        const hero = heroes[editingIndex];
        hero.name = name;
        hero.realName = realName;
        hero.sex = sex;
        hero.height = height;
        hero.weight = weight;
        hero.local = local;
        hero.birth = birth;

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                hero.image = event.target.result;
                saveHeroesToLocalStorage();
                updateCarousel();
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveHeroesToLocalStorage();
            updateCarousel();
        }
    } else {
        const newHero = { name, realName, sex, height, weight, local, birth, image: null };

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                newHero.image = event.target.result;
                heroes.push(newHero);
                saveHeroesToLocalStorage();
                updateCarousel();
            };
            reader.readAsDataURL(imageFile);
        } else {
            newHero.image = "placeholder.png";
            heroes.push(newHero);
            saveHeroesToLocalStorage();
            updateCarousel();
        }
    }

    closeModal();
});

createHeroBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);

updateCarousel();
