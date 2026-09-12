const inputCidade = document.getElementById('inputCidade');
const sugestoesBox = document.getElementById('sugestoes');
const elementoResultado = document.getElementById('resultado');

let timerBusca;

// Escuta a digitação do usuário
inputCidade.addEventListener('input', () => {
    const termo = inputCidade.value.trim();

    clearTimeout(timerBusca);

    if (termo.length < 2) {
        sugestoesBox.innerHTML = '';
        return;
    }

    // Debounce: aguarda 300ms após parar de digitar antes de chamar a API
    timerBusca = setTimeout(() => {
        buscarSugestoes(termo);
    }, 300);
});

// Busca cidades pelo nome na API de Geocoding da Open-Meteo
async function buscarSugestoes(termo) {
    const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(termo)}&count=5&language=pt&format=json`;

    try {
        const response = await fetch(urlGeocoding);
        const data = await response.json();

        sugestoesBox.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(cidade => {
                const item = document.createElement('div');
                item.classList.add('sugestao-item');
                
                const estado = cidade.admin1 ? `, ${cidade.admin1}` : '';
                const pais = cidade.country ? ` (${cidade.country})` : '';
                item.innerText = `${cidade.name}${estado}${pais}`;

                // Quando clicar na sugestão:
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

// Busca o clima atual com base em latitude e longitude
async function obterPrevisao(lat, lon, nomeCidade) {
    const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    elementoResultado.innerHTML = '<p class="instrucao">Carregando clima...</p>';

    try {
        const response = await fetch(urlClima);
        const data = await response.json();
        const clima = data.current_weather;

        elementoResultado.innerHTML = `
            <div class="resultado-box">
                <div class="cidade-nome">${nomeCidade}</div>
                <div class="temperatura">${clima.temperature} °C</div>
                <div class="detalhes">Vento: ${clima.windspeed} km/h</div>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        elementoResultado.innerHTML = '<p class="instrucao">Erro ao carregar o clima.</p>';
    }
}

// Esconde a lista se o usuário clicar fora do campo
document.addEventListener('click', (e) => {
    if (!inputCidade.contains(e.target) && !sugestoesBox.contains(e.target)) {
        sugestoesBox.innerHTML = '';
    }
});