const addCrimeBtn = document.getElementById("add-crime-btn");
const crimeModal = document.getElementById("crime-modal");
const crimeForm = document.getElementById("crime-form");
const crimeList = document.getElementById("crime-list");
const closeModalBtn = document.getElementById("close-modal");
const heroiSelect = document.getElementById("responsible-hero");

let crimes = [];
let herois = [];

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
        const li = document.createElement('li');
        li.className = 'crime-item';
        
        // Formatando a data para exibição (se existir)
        const dataFormatada = crime.data_crime ? new Date(crime.data_crime).toLocaleDateString('pt-BR') : 'Não informada';
        
        li.innerHTML = `
            <div class="crime-info">
                <h3>${crime.nome_crime || 'Nome não informado'}</h3>
                <p><strong>Severidade:</strong> ${crime.severidade || 'Não informada'}</p>
                <p><strong>Descrição:</strong> ${crime.descricao_evento || 'Não informada'}</p>
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Herói:</strong> ${crime.nome_heroi || 'Não informado'}</p>
            </div>
            <div class="crime-actions">
                <button class="edit-btn" onclick="editarCrime(${crime.id_crime})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-btn" onclick="apagarCrime(${crime.id_crime})">
                    <i class="fas fa-trash"></i> Apagar
                </button>
            </div>
        `;
        
        crimeList.appendChild(li);
    });
}

// Função para editar crime
async function editarCrime(id) {
    const crime = crimes.find(c => c.id_crime === id);
    if (!crime) return;

    // Preenche o modal com os dados do crime
    document.getElementById("crime-title").value = crime.nome_crime;
    document.getElementById("crime-description").value = crime.descricao_evento;
    document.getElementById("crime-severity").value = crime.severidade;
    document.getElementById("crime-date").value = crime.data_crime;
    document.getElementById("responsible-hero").value = crime.nome_heroi;

    // Mostra o modal
    showCrimeModal();

    // Modifica o comportamento do formulário para atualizar ao invés de criar
    crimeForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const crimeAtualizado = {
            id_crime: id,
            nome_crime: document.getElementById("crime-title").value,
            descricao_evento: document.getElementById("crime-description").value,
            severidade: parseInt(document.getElementById("crime-severity").value, 10),
            data_crime: document.getElementById("crime-date").value,
            nome_heroi: document.getElementById("responsible-hero").value,
        };

        try {
            // Implementar chamada à API para atualizar o crime
            // await fetch('http://localhost:8080/atualizarcrime', {...});
            
            const index = crimes.findIndex(c => c.id_crime === id);
            crimes[index] = crimeAtualizado;
            renderCrimeList();
            hideCrimeModal();
            
            // Restaura o comportamento padrão do formulário
            crimeForm.onsubmit = null;
        } catch (error) {
            console.error('Erro ao atualizar crime:', error);
            alert('Erro ao atualizar o crime');
        }
    };
}

// Função para apagar crime
async function apagarCrime(id) {
    if (!confirm('Tem certeza que deseja apagar este crime?')) return;

    try {
        // Implementar chamada à API para deletar o crime
        // await fetch(`http://localhost:8080/deletarcrime/${id}`, { method: 'DELETE' });
        
        crimes = crimes.filter(crime => crime.id_crime !== id);
        renderCrimeList();
    } catch (error) {
        console.error('Erro ao apagar crime:', error);
        alert('Erro ao apagar o crime');
    }
}

// Modificar o evento de submit do formulário
crimeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newCrime = {
        nome_crime: document.getElementById("crime-title").value,
        descricao_evento: document.getElementById("crime-description").value,
        severidade: parseInt(document.getElementById("crime-severity").value, 10),
        data_crime: document.getElementById("crime-date").value,
        id_heroi: document.getElementById("responsible-hero").value,
    };

    try {
        // Aqui você implementará a chamada à API para salvar o crime
        // await fetch('http://localhost:8080/adicionarcrime', {...});
        
        crimes.push(newCrime);
        renderCrimeList();
        hideCrimeModal();
    } catch (error) {
        console.error('Erro ao salvar crime:', error);
        alert('Erro ao salvar o crime');
    }
});

// Inicialização
window.addEventListener('load', () => {
    carregarHerois();
    carregarCrimes();
});