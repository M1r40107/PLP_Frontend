const heroes = [

    {
        name: "Homelander",
        realName: "John",
        sex: "Masculino",
        height: "1.80",
        weight: "90",
        local: "Desconhecido",
        birth: "1981-06-10",
        image: "images/capitao_patria.jpg",
    },

    {
        name: "StarLight",
        realName: "Annie January",
        sex: "Feminino",
        height: "1.65",
        weight: "55",
        local: "Estados Unidos",
        birth: "1991-05-01",
        image: "images/starlight.jpeg",
    },

    {
        name: "Queen Maeve",
        realName: "Maeve",
        sex: "Feminino",
        height: "1.75",
        weight: "70",
        local: "Estados Unidos",
        birth: "1980-04-15",
        image: "images/queen_maeve.jpeg",
    },

    {
        name: "A-Train",
        realName: "Reggie Franklin",
        sex: "Masculino",
        height: "1.77",
        weight: "80",
        local: "Estados Unidos",
        birth: "1986-03-01",
        image: "images/a-train.jpeg",
    },

    {
        name: "The Deep",
        realName: "Kevin Moskowitz",
        sex: "Masculino",
        height: "1.80",
        weight: "85",
        local: "Estados Unidos",
        birth: "1986-07-25",
        image: "images/the-deep.jpeg",
    },
];

const createHeroBtn = document.getElementById("create-hero-btn");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const entityForm = document.getElementById("entity-form");
const heroesCarousel = document.getElementById("heroes-carousel");

function showModal() {
    createModal.classList.remove("hidden");
}

function closeModal() {
    createModal.classList.add("hidden");
    entityForm.reset();
}

function updateCarousel() {
    heroesCarousel.innerHTML = ""; 
    heroes.forEach((hero) => {
        const card = document.createElement("div");
        card.classList.add("carousel-item");

        card.innerHTML = `
            <div class="hero-image1" style="background-image: url('${hero.image}')"></div>
            <h3>${hero.name}</h3>
            <p><strong>Nome Real:</strong> ${hero.realName}</p>
            <p><strong>Sexo:</strong> ${hero.sex}</p>
            <p><strong>Altura:</strong> ${hero.height}m</p>
            <p><strong>Peso:</strong> ${hero.weight}kg</p>
            <p><strong>Local:</strong> ${hero.local}</p>
            <p><strong>Data de Nascimento:</strong> ${hero.birth}</p>
        `;
        heroesCarousel.appendChild(card);
    });
}

entityForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("entity-name").value;
    const realName = document.getElementById("entity-real-name").value;
    const sex = document.querySelector('input[name="Sexo"]:checked').value;
    const height = document.getElementById("entity-height").value;
    const weight = document.getElementById("entity-weight").value;
    const local = document.getElementById("entity-local").value;
    const birth = document.getElementById("entity-birth").value;
    const imageFile = document.getElementById("entity-image").files[0];

    const newHero = { name, realName, sex, height, weight, local, birth, image: null };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            newHero.image = event.target.result;
            heroes.push(newHero); 
            updateCarousel(); 
        };
        reader.readAsDataURL(imageFile);
    } else {
        newHero.image = "placeholder.png"; 
        heroes.push(newHero);
        updateCarousel();
    }

    closeModal();
});

createHeroBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);

// Inicializa o carrossel com os heróis existentes
updateCarousel();
