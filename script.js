const weatherWidget = document.getElementById("weather-widget");
const teaCards = document.querySelectorAll(".cha-card");
const form = document.querySelector("form");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const mensagemInput = document.getElementById("mensagem");
const filtro = document.getElementById("filtro")


function showWeatherError(message) {
    weatherWidget.innerHTML = `<p class="weather-status">${message}</p>`;
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
            text: "Prefira chas mais refrescantes (inclusive gelados).",
            profile: "frio"
        };
    }

    if (temp <= 18) {
        return {
            title: "Dia frio",
            text: "Prefira infusoes quentes e mais aconchegantes.",
            profile: "quente"
        };
    }

    return {
        title: "Clima ameno",
        text: "Hoje vale escolher um cha equilibrado para qualquer horario.",
        profile: "frio"
    };
}

async function loadWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Falha ao consultar clima.");
    }

    const data = await response.json();
    return data.current.temperature_2m;
}

function renderRecommendation(temp) {
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

function init() {
    if (!navigator.geolocation) {
        showWeatherError("Seu navegador nao suporta geolocalizacao.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            try {
                const temp = await loadWeather(coords.latitude, coords.longitude);
                renderRecommendation(temp);
            } catch (error) {
                showWeatherError("Nao foi possivel carregar o clima agora.");
            }
        },
        () => showWeatherError("Permita localizacao para receber recomendacoes do clima."),
        { timeout: 10000 }
    );
}

init();


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

function validateForm(e) {
    let isValid = true;

    if (!nomeInput || !emailInput || !mensagemInput) {
        return;
    }

    if (!nomeInput.value.trim()) {
        showError(nomeInput, "Nome é obrigatório.");
        isValid = false;
    } else {
        clearError(nomeInput);
    }

    if (!emailInput.value.trim()) {
        showError(emailInput, "E-mail é obrigatório.");
        isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, "Insira um e-mail válido (ex: nome@dominio.com).");
        isValid = false;
    } else {
        clearError(emailInput);
    }

    if (!mensagemInput.value.trim()) {
        showError(mensagemInput, "Mensagem não pode estar vazia.");
        isValid = false;
    } else {
        clearError(mensagemInput);
    }

    if (!isValid) {
        e.preventDefault(); // Impede envio
        alert("Corrija os erros antes de enviar.");
    } else {
        e.preventDefault(); // Remove esta linha se quiser realmente enviar
        alert("Formulário enviado com sucesso! (demonstração)");
        form.reset();
    }
}

if (form) {
    form.addEventListener("submit", validateForm);
}

filtro.addEventListener("change", () => {

    const valorSelecionado = filtro.value;

    teaCards.forEach(card =>{

        const preco = Number(card.dataset.price)

        if(valorSelecionado === "todos"){
            card.style.display = "block";
        }
        else if (preco <= Number(valorSelecionado)){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }
    });
});
