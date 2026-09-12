const url = 'https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current_weather=true';

const elementoResultado = document.getElementById('resultado');

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados do clima');
        }
        return response.json();
    })
    .then(data => {
        const clima = data.current_weather;
        
        elementoResultado.innerHTML = `
            <div class="temperatura">${clima.temperature} °C</div>
            <div class="detalhes">Vento: ${clima.windspeed} km/h</div>
        `;
    })
    .catch(error => {
        console.error('Erro:', error);
        elementoResultado.innerText = 'Falha ao carregar a previsão.';
    });