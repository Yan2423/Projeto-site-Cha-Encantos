// ===== ELEMENTOS GLOBAIS =====
const weatherWidget = document.getElementById("weather-widget");
const teaCards = document.querySelectorAll(".cha-card");
const filtro = document.getElementById("filtro");

const API_URL = 'http://localhost:5000/api';

// ===== CLIMA E RECOMENDAÇÃO =====

function showWeatherError(message) {
    if (weatherWidget) {
        weatherWidget.innerHTML = `<p class="weather-status">${message}</p>`;
    }
}

function applyHighlight(profile) {
    teaCards.forEach((card) => {
        const shouldHighlight = card.dataset.profile === profile;
        card.classList.toggle("clima-destaque", shouldHighlight);
    });
}

function getRecommendation(temp) {
    if (temp >= 27) {
        return {
            title: "Dia quente",
            text: "Prefira chás mais refrescantes (inclusive gelados).",
            profile: "frio"
        };
    }
    if (temp <= 18) {
        return {
            title: "Dia frio",
            text: "Prefira infusões quentes e mais aconchegantes.",
            profile: "quente"
        };
    }
    return {
        title: "Clima ameno",
        text: "Hoje vale escolher um chá equilibrado para qualquer horário.",
        profile: "frio"
    };
}

async function loadWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Falha ao consultar clima.");
    const data = await response.json();
    return data.current.temperature_2m;
}

function renderRecommendation(temp) {
    if (!weatherWidget) return;
    const rounded = Math.round(temp);
    const recommendation = getRecommendation(rounded);

    applyHighlight(recommendation.profile);

    const names = Array.from(teaCards)
        .filter((card) => card.dataset.profile === recommendation.profile)
        .map((card) => card.querySelector("h3").textContent);

    weatherWidget.innerHTML = `
        <p class="weather-temp">${rounded}°C agora</p>
        <p class="weather-message"><strong>${recommendation.title}:</strong> ${recommendation.text}</p>
        <ul class="weather-list">
            ${names.map((name) => `<li>${name}</li>`).join("")}
        </ul>
    `;
}

function initWeather() {
    if (!weatherWidget) return;
    if (!navigator.geolocation) {
        showWeatherError("Seu navegador não suporta geolocalização.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            try {
                const temp = await loadWeather(coords.latitude, coords.longitude);
                renderRecommendation(temp);
            } catch (error) {
                showWeatherError("Não foi possível carregar o clima agora.");
            }
        },
        () => showWeatherError("Permita a localização para receber recomendações do clima."),
        { timeout: 10000 }
    );
}

initWeather();

// ===== FILTRO DE PREÇO (somente catalogo.html) =====

if (filtro) {
    filtro.addEventListener("change", () => {
        const valorSelecionado = filtro.value;
        teaCards.forEach(card => {
            const preco = Number(card.dataset.price);
            if (valorSelecionado === "todos" || preco <= Number(valorSelecionado)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// ===== VALIDAÇÕES DO FORMULÁRIO =====

function showError(input, message) {
    let error = input.parentNode.querySelector(".error-message");
    if (!error) {
        error = document.createElement("span");
        error.className = "error-message";
        error.style.color = "#c0392b";
        error.style.fontSize = "0.85em";
        error.style.marginTop = "5px";
        input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = message;
    input.style.borderColor = "#c0392b";
}

function clearError(input) {
    const error = input.parentNode.querySelector(".error-message");
    if (error) error.remove();
    input.style.borderColor = "#D4A574";
}

function validateEmail(email) {
    return /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
}

// ===== FORMULÁRIO DE CONTATO COM API =====

async function enviarContato(dados) {
    try {
        const response = await fetch(`${API_URL}/contato`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro na API:', error);
        return { success: false, error: 'Erro de conexão com o servidor. Verifique se a API está rodando.' };
    }
}

function mostrarFeedback(mensagem, tipo) {
    const feedbackDiv = document.getElementById('formFeedback');
    if (!feedbackDiv) return;
    feedbackDiv.innerHTML = `
        <div style="
            padding: 12px;
            border-radius: 8px;
            background-color: ${tipo === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${tipo === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${tipo === 'success' ? '#c3e6cb' : '#f5c6cb'};
        ">${mensagem}</div>
    `;
    setTimeout(() => { feedbackDiv.innerHTML = ''; }, 5000);
}

const formContato = document.getElementById('formContato');

if (formContato) {
    formContato.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nomeInput     = document.getElementById('nome');
        const emailInput    = document.getElementById('email');
        const mensagemInput = document.getElementById('mensagem');

        const nome     = nomeInput.value.trim();
        const email    = emailInput.value.trim();
        const mensagem = mensagemInput.value.trim();

        // Limpar erros anteriores
        [nomeInput, emailInput, mensagemInput].forEach(clearError);

        let valido = true;

        if (!nome) {
            showError(nomeInput, "Nome é obrigatório.");
            valido = false;
        }
        if (!email) {
            showError(emailInput, "E-mail é obrigatório.");
            valido = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, "Insira um e-mail válido (ex: nome@dominio.com).");
            valido = false;
        }
        if (!mensagem) {
            showError(mensagemInput, "Mensagem não pode estar vazia.");
            valido = false;
        }

        if (!valido) return;

        const btnSubmit = formContato.querySelector('button[type="submit"]');
        const textoOriginal = btnSubmit.textContent;
        btnSubmit.textContent = 'Enviando...';
        btnSubmit.disabled = true;

        const resultado = await enviarContato({ nome, email, mensagem });

        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;

        if (resultado.success) {
            mostrarFeedback(resultado.message, 'success');
            formContato.reset();
        } else {
            mostrarFeedback(resultado.error || 'Erro ao enviar mensagem. Tente novamente.', 'error');
        }
    });
}

// SISTEMA DE POPUPS 

function abrirPopup({ icone = '🍵', titulo = '', mensagem = '', input = false, confirmacao = false }) {
    return new Promise((resolve) => {
        document.getElementById('popupIcone').textContent    = icone;
        document.getElementById('popupTitulo').textContent   = titulo;
        document.getElementById('popupMensagem').textContent = mensagem;

        const el_input     = document.getElementById('popupInput');
        const el_cancelar  = document.getElementById('popupCancelar');
        const el_confirmar = document.getElementById('popupConfirmar');
        const overlay      = document.getElementById('popupOverlay');

        el_input.style.display    = input       ? 'block' : 'none';
        el_cancelar.style.display = confirmacao ? 'block' : 'none';
        el_input.value = '';

        overlay.classList.add('ativo');

        el_confirmar.onclick = () => {
            overlay.classList.remove('ativo');
            resolve(input ? el_input.value : true);
        };

        el_cancelar.onclick = () => {
            overlay.classList.remove('ativo');
            resolve(false);
        };
    });
}

// Substitutos diretos do alert / confirm / prompt:

function Alerta(mensagem, icone = '🍵') {
    return abrirPopup({ icone, titulo: 'Chá & Encantos', mensagem });
}

function Confirmar(mensagem) {
    return abrirPopup({ icone: '⚠️', titulo: 'Tem certeza?', mensagem, confirmacao: true });
}

function Perguntar(titulo, mensagem) {
    return abrirPopup({ icone: '📝', titulo, mensagem, input: true });
}


