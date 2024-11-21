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

function updateCarousel() {
    heroesCarousel.innerHTML = ""; 
    heroes.forEach((hero, index) => {
        const card = document.createElement("div");
        card.classList.add("carousel-item");

        card.innerHTML = `
            <div class="hero-image1" style="background-image: url('${hero.image}')"></div>
            <h3>${hero.name}</h3>
            <button class="view-btn" data-id="${index}">Ver</button>
            <button class="edit-btn" data-id="${index}">Editar</button>
            <button class="delete-btn" data-id="${index}">Excluir</button>
        `;
        heroesCarousel.appendChild(card);
    });

    document.querySelectorAll(".view-btn").forEach((btn) =>
        btn.addEventListener("click", (e) => viewHero(e.target.dataset.id))
    );

    document.querySelectorAll(".edit-btn").forEach((btn) =>
        btn.addEventListener("click", (e) => editHero(e.target.dataset.id))
    );

    document.querySelectorAll(".delete-btn").forEach((btn) =>
        btn.addEventListener("click", (e) => deleteHero(e.target.dataset.id))
    );
}

function viewHero(index) {
    const hero = heroes[index];
    alert(`
        Nome: ${hero.name}
        Nome Real: ${hero.realName}
        Sexo: ${hero.sex}
        Altura: ${hero.height} m
        Peso: ${hero.weight} kg
        Local de Nascimento: ${hero.local}
        Data de Nascimento: ${hero.birth}
    `);
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
