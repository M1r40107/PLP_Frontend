const heroesCarousel = document.getElementById("heroes-carousel");
const createHeroBtn = document.getElementById("create-hero-btn");
const createModal = document.getElementById("create-modal");
const closeModalBtn = document.getElementById("close-modal");
const entityForm = document.getElementById("entity-form");

let heroes = JSON.parse(localStorage.getItem("heroes")) || [];

function saveHeroesToLocalStorage() {
    localStorage.setItem("heroes", JSON.stringify(heroes));
}

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

    closeModal();
});

createHeroBtn.addEventListener("click", showModal);

closeModalBtn.addEventListener("click", closeModal);

updateCarousel();
