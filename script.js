const inputCidade = document.getElementById('inputCidade');
const sugestoesBox = document.getElementById('sugestoes');
const elementoResultado = document.getElementById('resultado');

// Elementos do Menu Lateral
const sidebar = document.getElementById('sidebar');
const btnMenu = document.getElementById('btnMenu');
const btnFechar = document.getElementById('btnFechar');
const listaFavoritos = document.getElementById('listaFavoritos');

let timerBusca;
let cidadeAtualExibida = ""; // Guarda o nome da cidade atual para podermos salvar

// --- Lógica de Abrir/Fechar Menu Lateral ---
btnMenu.addEventListener('click', () => {
    sidebar.classList.add('aberta');
});

btnFechar.addEventListener('click', () => {
    sidebar.classList.remove('aberta');
});

// --- Funções de Favoritos (Integradas ao Supabase) ---

// Essa função será chamada ao clicar no botão "Salvar Favorito" gerado pela API de clima
function salvarCidadeAtual() {
    if (cidadeAtualExibida && window.salvarFavoritoDB) {
        window.salvarFavoritoDB(cidadeAtualExibida);
        sidebar.classList.add('aberta'); // Abre o menu para mostrar que salvou
    }
}

// Essa função é chamada pelo Supabase (no index.html) após ler os dados
window.renderizarLista = function (dados) {
    listaFavoritos.innerHTML = '';

    if (!dados || dados.length === 0) {
        listaFavoritos.innerHTML = '<p class="instrucao">Nenhum favorito salvo.</p>';
        return;
    }

    dados.forEach(item => {
        const divItem = document.createElement('div');
        divItem.classList.add('favorito-item');

        const nomeDaCidade = item.name_city;

        // Cria o nome da cidade que pode ser clicado
        const spanNome = document.createElement('span');
        spanNome.classList.add('favorito-nome');
        spanNome.innerText = nomeDaCidade;

        spanNome.addEventListener('click', () => {
            inputCidade.value = nomeDaCidade;
            sidebar.classList.remove('aberta');

            // Busca e abre o clima da cidade automaticamente
            buscarSugestoes(nomeDaCidade, true);
        });

        // Botão de remover
        const btnRemover = document.createElement('button');
        btnRemover.classList.add('btn-remover');
        btnRemover.innerText = 'X';
        btnRemover.addEventListener('click', () => {
            if (window.removerFavoritoDB) {
                // O id continua o mesmo, pois na sua tabela a coluna se chama 'id'
                window.removerFavoritoDB(item.id);
            }
        });

        divItem.appendChild(spanNome);
        divItem.appendChild(btnRemover);
        listaFavoritos.appendChild(divItem);
    });
}

// --- Lógica Original de Busca e Previsão (Com pequenas adições) ---

inputCidade.addEventListener('input', () => {
    const termo = inputCidade.value.trim();
    clearTimeout(timerBusca);

    if (termo.length < 2) {
        sugestoesBox.innerHTML = '';
        return;
    }

    timerBusca = setTimeout(() => {
        buscarSugestoes(termo, false);
    }, 300);
});

// Adicionado o parâmetro autoSelecionar para quando clicar em um favorito
async function buscarSugestoes(termo, autoSelecionar) {
    const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(termo)}&count=5&language=pt&format=json`;

    try {
        const response = await fetch(urlGeocoding);
        const data = await response.json();
        sugestoesBox.innerHTML = '';

        if (data.results && data.results.length > 0) {
            if (autoSelecionar) {
                // Se veio do clique do menu lateral, já carrega a primeira opção de cara
                const cidade = data.results[0];
                obterPrevisao(cidade.latitude, cidade.longitude, cidade.name);
                return;
            }

            data.results.forEach(cidade => {
                const item = document.createElement('div');
                item.classList.add('sugestao-item');

                const estado = cidade.admin1 ? `, ${cidade.admin1}` : '';
                const pais = cidade.country ? ` (${cidade.country})` : '';
                item.innerText = `${cidade.name}${estado}${pais}`;

                item.addEventListener('click', () => {
                    inputCidade.value = cidade.name;
                    sugestoesBox.innerHTML = '';
                    obterPrevisao(cidade.latitude, cidade.longitude, cidade.name);
                });

                sugestoesBox.appendChild(item);
            });
        } else {
            sugestoesBox.innerHTML = '<div class="sugestao-item">Nenhuma cidade encontrada</div>';
        }
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
    }
}

async function obterPrevisao(lat, lon, nomeCidade) {
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    elementoResultado.innerHTML = '<p class="instrucao">Carregando clima...</p>';

    try {
        const response = await fetch(urlClima);
        const data = await response.json();
        const clima = data.current_weather;

        cidadeAtualExibida = nomeCidade; // Atualiza a variável global para poder salvar

        // Foi adicionado o botão "Salvar Favorito" no final do HTML gerado
        elementoResultado.innerHTML = `
            <div class="resultado-box">
                <div class="cidade-nome">${nomeCidade}</div>
                <div class="temperatura">${clima.temperature} °C</div>
                <div class="detalhes">Vento: ${clima.windspeed} km/h</div>
                
                <button class="btn-salvar" onclick="salvarCidadeAtual()">Salvar Favorito</button>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        elementoResultado.innerHTML = '<p class="instrucao">Erro ao carregar o clima.</p>';
    }
}

// Esconde a lista de sugestões se o usuário clicar fora do campo
document.addEventListener('click', (e) => {
    if (!inputCidade.contains(e.target) && !sugestoesBox.contains(e.target)) {
        sugestoesBox.innerHTML = '';
    }
});