const addCrimeBtn = document.getElementById("add-crime-btn");
const crimeModal = document.getElementById("crime-modal");
const crimeForm = document.getElementById("crime-form");
const crimeList = document.getElementById("crime-list");
const closeModalBtn = document.getElementById("close-modal");

let crimes = [];

function showCrimeModal() {
    crimeModal.classList.remove("hidden");
}

function hideCrimeModal() {
    crimeModal.classList.add("hidden");
    crimeForm.reset();
}

function renderCrimeList() {
    crimeList.innerHTML = "";

    if (crimes.length === 0) {
        const noCrimes = document.createElement("li");
        noCrimes.textContent = "Nenhum crime cadastrado.";
        noCrimes.style.textAlign = "center";
        crimeList.appendChild(noCrimes);
        return;
    }

    crimes.forEach((crime, index) => {
        const crimeItem = document.createElement("li");

        const crimeInfo = document.createElement("div");
        crimeInfo.innerHTML = `
            <strong>${crime.titulo}</strong> - ${crime.data}
            <p>${crime.descricao}</p>
            <small>Gravidade: ${crime.gravidade} | Herói: ${crime.heroi}</small>
        `;
        crimeInfo.style.flexGrow = "1";

        const actions = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", () => editCrime(index));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteCrime(index));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        crimeItem.appendChild(crimeInfo);
        crimeItem.appendChild(actions);

        crimeList.appendChild(crimeItem);
    });
}

crimeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newCrime = {
        titulo: document.getElementById("crime-title").value,
        descricao: document.getElementById("crime-description").value,
        gravidade: parseInt(document.getElementById("crime-severity").value, 10),
        data: document.getElementById("crime-date").value,
        heroi: document.getElementById("responsible-hero").value,
    };

    crimes.push(newCrime);
    renderCrimeList();
    hideCrimeModal();
});

function deleteCrime(index) {
    crimes.splice(index, 1);
    renderCrimeList();
}

function editCrime(index) {
    const crime = crimes[index];

    document.getElementById("crime-title").value = crime.titulo;
    document.getElementById("crime-description").value = crime.descricao;
    document.getElementById("crime-severity").value = crime.gravidade;
    document.getElementById("crime-date").value = crime.data;
    document.getElementById("responsible-hero").value = crime.heroi;

    showCrimeModal();

    crimeForm.onsubmit = (event) => {
        event.preventDefault();

        crimes[index] = {
            titulo: document.getElementById("crime-title").value,
            descricao: document.getElementById("crime-description").value,
            gravidade: parseInt(document.getElementById("crime-severity").value, 10),
            data: document.getElementById("crime-date").value,
            heroi: document.getElementById("responsible-hero").value,
        };

        renderCrimeList();
        hideCrimeModal();

        crimeForm.onsubmit = null;
    };
}

addCrimeBtn.addEventListener("click", showCrimeModal);
closeModalBtn.addEventListener("click", hideCrimeModal);

renderCrimeList();
