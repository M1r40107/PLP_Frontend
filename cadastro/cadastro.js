document.getElementById("select-powers").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:8080/poderes");
        if (!response.ok) throw new Error("Erro ao buscar poderes.");

        const poderes = await response.json();
        const powersList = document.getElementById("powers-list");
        powersList.innerHTML = ""; // Limpa a lista de poderes

        poderes.forEach((poder) => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = JSON.stringify(poder);
            checkbox.id = `power-${poder.poder}`;

            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.innerText = `${poder.poder} - ${poder.descricao}`;

            li.appendChild(checkbox);
            li.appendChild(label);
            powersList.appendChild(li);
        });

        document.getElementById("powers-section").classList.remove("hidden");
    } catch (error) {
        console.error("Erro ao carregar poderes:", error);
        alert("Não foi possível carregar os poderes.");
    }
});

document.getElementById("hero-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedPowers = Array.from(
        document.querySelectorAll("#powers-list input:checked")
    ).map((checkbox) => JSON.parse(checkbox.value));

    const heroData = {
        heroi: {
            nome_real: document.getElementById("real-name").value,
            sexo: document.getElementById("sex").value,
            peso: parseFloat(document.getElementById("weight").value),
            altura: parseFloat(document.getElementById("height").value),
            data_nasc: document.getElementById("birth-date").value,
            local_nasc: document.getElementById("birthplace").value,
            nome_heroi: document.getElementById("hero-name").value,
            popularidade: parseInt(document.getElementById("popularity").value, 10),
            status: document.getElementById("status").value,
            forca: parseInt(document.getElementById("strength").value, 10),
        },
        poderes: selectedPowers,
    };

    try {
        const response = await fetch("http://localhost:8080/heroicadastra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(heroData),
        });

        if (!response.ok) throw new Error("Erro ao salvar herói.");

        alert("Herói cadastrado com sucesso!");
        document.getElementById("hero-form").reset();
        document.getElementById("powers-section").classList.add("hidden");
    } catch (error) {
        console.error("Erro ao salvar herói:", error);
        alert("Não foi possível salvar o herói.");
    }
});
