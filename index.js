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
        const response = await fetch("http://localhost:8080/");
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const heroes = await response.json();

        heroesCarousel.innerHTML = ""; 

        heroes.forEach((heroName) => {
            const card = document.createElement("div");
            card.classList.add("carousel-item");

            const imagePath = `assets/images/${heroName.toLowerCase().replace(/ /g, "_")}.jpg`;

            card.innerHTML = `
                <div class="hero-image1" style="background-image: url('${imagePath}')"></div>
                <h3>${heroName}</h3>
                <button class="view-btn" data-name="${heroName}">Ver</button>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            `;
            heroesCarousel.appendChild(card);
        });

        document.querySelectorAll(".view-btn").forEach((btn) =>
            btn.addEventListener("click", (e) => viewHero(e.target.dataset.name))
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

async function editHero(index) {
    const hero = heroes[index];
    editingIndex = index;

    // Preenche os campos do formulário com os dados do herói
    document.getElementById("entity-name").value = hero.name;
    document.getElementById("entity-real-name").value = hero.realName;
    document.getElementById("entity-sex").value = hero.sex;
    document.getElementById("entity-height").value = hero.height;
    document.getElementById("entity-weight").value = hero.weight;
    document.getElementById("entity-local").value = hero.local;
    document.getElementById("entity-birth").value = hero.birth;

    // Abre o modal
    showModal();

    // Adiciona o listener para envio do formulário ao salvar as alterações
    entityForm.onsubmit = async (e) => {
        e.preventDefault();

        const updatedHero = {
            nome_heroi: hero.name,
            heroi_atualizado: {
                nome_heroi: document.getElementById("entity-name").value,
                nome_real: document.getElementById("entity-real-name").value,
                sexo: document.getElementById("entity-sex").value,
                altura: parseFloat(document.getElementById("entity-height").value),
                peso: parseFloat(document.getElementById("entity-weight").value),
                data_nascimento: new Date(document.getElementById("entity-birth").value).toISOString(),
                local_nascimento: document.getElementById("entity-local").value,
                popularidade: hero.popularidade || 50, // Exemplo de valor padrão
                forca: hero.forca || 50, // Exemplo de valor padrão
                status_atividade: hero.status_atividade || "Ativo", // Exemplo de valor padrão
            },
        };

        try {
            const response = await fetch("http://localhost:8080/editar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedHero),
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar herói: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Herói atualizado com sucesso:", result);

            // Atualiza os dados localmente e recarrega o carrossel
            heroes[index] = {
                ...heroes[index],
                ...updatedHero.heroi_atualizado,
            };

            saveHeroesToLocalStorage();
            updateCarousel();
            closeModal();
        } catch (error) {
            console.error("Erro ao editar o herói:", error);
            alert("Não foi possível salvar as alterações do herói.");
        }
    };
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
