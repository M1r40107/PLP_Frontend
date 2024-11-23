const crimeModal = document.getElementById("crime-modal");
const crimeForm = document.getElementById("crime-form");
const crimeList = document.getElementById("crime-list");
const closeModalBtn = document.getElementById("close-modal");

// Função para carregar os heróis do backend
async function carregarHerois() {
    try {
        const response = await fetch('http://localhost:8080/');
        const data = await response.json();
        herois = data;
        preencherSelectHerois();
    } catch (error) {
        console.error('Erro ao carregar heróis:', error);
    }
}

// Função para preencher o select de heróis
function preencherSelectHerois() {
    heroiSelect.innerHTML = '<option value="">Selecione um herói</option>';
    herois.forEach(heroi => {
        const option = document.createElement('option');
        option.value = heroi.nome_heroi;
        option.textContent = heroi.nome_heroi;
        heroiSelect.appendChild(option);
    });
}

// Função para carregar os crimes do backend
async function carregarCrimes() {
    try {
        const response = await fetch('http://localhost:8080/severidadecrime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                severidade_minima: 0,
                severidade_maxima: 10
            })
        });
        const data = await response.json();
        console.log('Crimes carregados:', data); // Debug
        crimes = data;
        renderCrimeList();
    } catch (error) {
        console.error('Erro ao carregar crimes:', error);
    }
}

function showCrimeModal() {
    crimeModal.classList.remove("hidden");
}

function hideCrimeModal() {
    crimeModal.classList.add("hidden");
    crimeForm.reset();
}

// Função para renderizar a lista de crimes
function renderCrimeList() {
    crimeList.innerHTML = '';
    crimes.forEach(crime => {
        const data = crime.data_crime ? new Date(crime.data_crime) : new Date();
        const dataFormatada = data.toLocaleDateString('pt-BR');

        const crimeItem = document.createElement('li');
        crimeItem.className = 'crime-item';
        
        crimeItem.innerHTML = `
            <div class="crime-info">
                <h3>${crime.nome_crime || 'Nome não informado'}</h3>
                <p><strong>Severidade:</strong> ${crime.severidade || 'Não informada'}</p>
                <p><strong>Descrição:</strong> ${crime.descricao_evento || 'Não informada'}</p>
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Herói:</strong> ${crime.nome_heroi || 'Não informado'}</p>
            </div>
            <div class="crime-actions">
                <button class="delete-btn" data-crime-id="${crime.id_crime}">Excluir</button>
            </div>
        `;
        
        // Adicionar event listeners após criar os elementos
        const deleteBtn = crimeItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            console.log('Botão excluir clicado para crime:', crime.id_crime);
            handleDeletecrime(crime.id_crime, crime.nome_heroi);
        });

        crimeList.appendChild(crimeItem);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    carregarCrimes();
});

// Editar missão
async function handleDeletecrime(crimeId, nomeHeroi) {
    console.log('Tentando deletar crime:', { crimeId, nomeHeroi });
    
    if (!crimeId) {
        console.error('ID do crime não encontrado');
        return;
    }

    if (!confirm('Tem certeza que deseja excluir este crime?')) {
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/deletecrime/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_crime: parseInt(crimeId),
                nome_heroi: nomeHeroi
            })
        });

        if (!response.ok) throw new Error('Erro ao excluir o crime');

        await carregarCrimes();
        alert('Crime excluído com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir o crime');
    }
}


// Modificar o evento de submit do formulário
crimeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const crimeId = crimeForm.dataset.editingId;
    if (!crimeId) {
        alert('Operação inválida: ID do crime não encontrado');
        return;
    }

    const crimeData = {
        id_crime: parseInt(crimeId),
        nome_crime: document.getElementById("crime-select").value,
        descricao_evento: document.getElementById("crime-description").value,
        severidade: parseInt(document.getElementById("crime-severity").value),
        data_crime: document.getElementById("crime-date").value,
        nome_heroi: document.getElementById("responsible-hero").value
    };

    try {
        const response = await fetch(`http://localhost:8080/editacrime/${crimeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(crimeData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao atualizar crime: ${response.status} - ${errorText}`);
        }

        // Limpar o formulário e fechar o modal
        crimeForm.reset();
        crimeForm.dataset.editingId = '';
        document.getElementById("crime-modal").classList.add("hidden");
        
        // Atualizar a lista de crimes
        await carregarCrimes();
        
        alert('Crime atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar crime:', error);
        alert(`Erro ao atualizar crime: ${error.message}`);
    }
});