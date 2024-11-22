const createHeroBtn = document.getElementById("create-hero-btn");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const entityForm = document.getElementById("entity-form");
const heroesCarousel = document.getElementById("heroes-carousel");
const nameFilter = document.getElementById("name-filter");
const statusFilter = document.getElementById("status-filter");
const popularityInput = document.getElementById("popularity-input");
const applyFilterBtn = document.getElementById("apply-filter");

nameFilter.removeEventListener("input", updateCarousel);
statusFilter.removeEventListener("change", updateCarousel);
popularityInput.removeEventListener("input", updateCarousel);
applyFilterBtn.addEventListener("click", updateCarousel);

let editingHeroName = null;

function showModal() {
    createModal.classList.remove("hidden");
}

function closeModal() {
    createModal.classList.add("hidden");
    entityForm.reset();
    editingHeroName = null;
}

function updateHeroImage(heroName, imageElement) {
    const imagePath = `./images/${heroName.toLowerCase().replace(/ /g, "_")}.jpeg`;
    
    // Testa se a imagem existe
    const img = new Image();
    img.onerror = () => {
        // Se a imagem não existir, usa a imagem padrão
        imageElement.style.backgroundImage = `url('./images/default.jpeg')`;
    };
    img.onload = () => {
        // Se a imagem existir, usa ela
        imageElement.style.backgroundImage = `url('${imagePath}')`;
    };
    img.src = imagePath;
}

async function updateCarousel() {
    try {
        const response = await fetch("http://localhost:8080/");
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }

        const heroes = await response.json();
        heroesCarousel.innerHTML = "";
        
        for (const heroName of heroes) {
            const detailsResponse = await fetch("http://localhost:8080/heroi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nome_heroi: heroName }),
            });
            
            if (!detailsResponse.ok) continue;
            
            const heroDetails = await detailsResponse.json();
            
            // Aplicar filtros
            const nameMatch = !nameFilter.value || 
                            heroName.toLowerCase().includes(nameFilter.value.toLowerCase());
            const statusMatch = !statusFilter.value || 
                            heroDetails.status_atividade === statusFilter.value;
            const popularityMatch = !popularityInput.value || 
                            heroDetails.popularidade >= parseInt(popularityInput.value || 0);
            
            if (nameMatch && statusMatch && popularityMatch) {
                const card = document.createElement("div");
                card.classList.add("carousel-item");

                // Criar o elemento da imagem
                const heroImage = document.createElement("div");
                heroImage.classList.add("hero-image1");
                
                // Atualizar a imagem usando a nova função
                updateHeroImage(heroName, heroImage);

                // Primeiro adiciona a imagem
                card.appendChild(heroImage);
                
                // Depois adiciona o resto do conteúdo
                const contentDiv = document.createElement("div");
                contentDiv.innerHTML = `
                    <h3>${heroName}</h3>
                    <button class="view-btn" data-name="${heroName}">Ver</button>
                    <button class="edit-btn" data-name="${heroName}">Editar</button>
                    <button class="delete-btn" data-name="${heroName}">Excluir</button>
                `;
                card.appendChild(contentDiv);
            
                heroesCarousel.appendChild(card);
            }
        }

        // Adicionar event listeners aos botões
        document.querySelectorAll(".view-btn").forEach(btn =>
            btn.addEventListener("click", (e) => viewHero(e.target.dataset.name))
        );

        document.querySelectorAll(".edit-btn").forEach(btn =>
            btn.addEventListener("click", (e) => openEditModal(e.target.dataset.name))
        );

        document.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", (e) => deleteHero(e.target.dataset.name))
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
            Vitorias: ${heroDetails.qtd_vitorias}
            Derrotas: ${heroDetails.qtd_derrotas}
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
    const height = parseFloat(document.getElementById("entity-height").value);
    const weight = parseFloat(document.getElementById("entity-weight").value);
    const birth = document.getElementById("entity-birth").value;
    const local = document.getElementById("entity-local").value;
    const popularity = parseInt(document.getElementById("entity-popularity").value, 10);
    const strength = parseInt(document.getElementById("entity-strength").value, 10);
    const status = document.getElementById("entity-status").value;

    // Função para converter o formato de data
    const convertDateToISO8601 = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${year}-${month}-${day}T00:00:00Z`;
    };

    const formattedBirthDate = convertDateToISO8601(birth);

    const heroData = {
        nome_heroi: editingHeroName, // Nome do herói original que está sendo editado
        heroi_atualizado: {
            nome_heroi: name,
            nome_real: realName,
            sexo: sex,
            altura: height,
            peso: weight,
            data_nascimento: formattedBirthDate,
            local_nascimento: local,
            popularidade: popularity,
            forca: strength,
            status_atividade: status
        }
    };

    try {
        const response = await fetch('http://localhost:8080/editar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(heroData),
        });

        if (!response.ok) {
            throw new Error(`Erro ao salvar alterações do herói: ${response.statusText}`);
        }
        
        alert('Herói atualizado com sucesso!');
        closeModal();
        updateCarousel();
        
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