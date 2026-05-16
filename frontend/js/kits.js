const chasDisponiveis = [
    { nome: "Camomila Serenidade", preco: 18 },
    { nome: "Hibisco Vermelho", preco: 22 },
    { nome: "Hortelã do Campo", preco: 16 },
    { nome: "Capim-Santo", preco: 15 },
    { nome: "Chá Verde Puro", preco: 25 },
    { nome: "Gengibre com Limão", preco: 20 },
    { nome: "Lavanda Imperial", preco: 24 },
    { nome: "Frutas Vermelhas", preco: 27 },
    { nome: "Canela Oriental", preco: 19 },
    { nome: "Pêssego Gelado", preco: 23 },
    { nome: "Erva-Doce Natural", preco: 17 },
    { nome: "Maçã com Canela", preco: 26 },
    { nome: "Jasmim Imperial", preco: 29 },
    { nome: "Mate Tropical", preco: 21 },
    { nome: "Cacau & Especiarias", preco: 30 },
    { nome: "Limão Siciliano", preco: 18 },
    { nome: "Baunilha Dourada", preco: 28 },
    { nome: "Maracujá Calmante", preco: 20 }
];
 
const API_URL = 'http://localhost:5000/api';
 
const container = document.getElementById("lista-chas-kit");
let selecionados = {};
 
function renderizarListaChas() {
    container.innerHTML = "";
    chasDisponiveis.forEach(cha => {
        const div = document.createElement("div");
        div.className = "cha-checkbox-item";
        div.innerHTML = `
            <label>
                <strong>${cha.nome}</strong> - R$ ${cha.preco.toFixed(2)}
            </label>
            <div class="quantidade-wrapper">
                <input type="number" min="0" max="10" value="0" step="1"
                    class="quantidade-input"
                    data-nome="${cha.nome}"
                    data-preco="${cha.preco}">
                <span>unid.</span>
            </div>
        `;
        container.appendChild(div);
    });
 
    document.querySelectorAll(".quantidade-input").forEach(input => {
        input.addEventListener("change", function () {
            const nome = this.dataset.nome;
            const preco = parseFloat(this.dataset.preco);
            let qtd = parseInt(this.value) || 0;
            if (qtd < 0) qtd = 0;
            if (qtd > 10) qtd = 10;
            this.value = qtd;
 
            if (qtd === 0) {
                delete selecionados[nome];
            } else {
                selecionados[nome] = { preco, quantidade: qtd };
            }
            atualizarTotal();
        });
    });
}
 
function atualizarTotal() {
    let total = 0;
    for (let nome in selecionados) {
        total += selecionados[nome].preco * selecionados[nome].quantidade;
    }
    document.getElementById("total-kit").innerHTML = `Total do kit: R$ ${total.toFixed(2)}`;
}
 
// ===== POPUPS PERSONALIZADOS =====
 
function abrirPopup({ titulo = '', mensagem = '', input = false, confirmacao = false }) {
    return new Promise((resolve) => {
     
        document.getElementById('popupTitulo').textContent   = titulo;
        document.getElementById('popupMensagem').textContent = mensagem;
 
        const el_input    = document.getElementById('popupInput');
        const el_cancelar = document.getElementById('popupCancelar');
        const overlay     = document.getElementById('popupOverlay');
 
        el_input.style.display    = input       ? 'block' : 'none';
        el_cancelar.style.display = confirmacao ? 'block' : 'none';
        el_input.value = '';
 
        overlay.classList.add('ativo');
 
        document.getElementById('popupConfirmar').onclick = () => {
            overlay.classList.remove('ativo');
            resolve(input ? el_input.value : true);
        };
 
        el_cancelar.onclick = () => {
            overlay.classList.remove('ativo');
            resolve(false);
        };
    });
}
 
function Alerta(mensagem) {
    return abrirPopup({ titulo: 'Chá & Encantos', mensagem });
}
 
function Confirmar(mensagem) {
    return abrirPopup({  titulo: 'Tem certeza?', mensagem, confirmacao: true });
}
 
function Perguntar(titulo, mensagem) {
    return abrirPopup({titulo, mensagem, input: true });
}
 
// MONTAR KIT 
 
async function montarKit() {
    const itens = Object.keys(selecionados);
    if (itens.length === 0) {
        await Alerta("Por favor, selecione pelo menos um chá e defina a quantidade > 0.");
        return;
    }

    const itensList = itens.map(nome => ({
        nome,
        quantidade: selecionados[nome].quantidade,
        subtotal: selecionados[nome].preco * selecionados[nome].quantidade
    }));

    const valorTotal = itensList.reduce((acc, i) => acc + i.subtotal, 0);

    let resumo = "Seu kit foi montado com sucesso!\n\n";
    itensList.forEach(i => {
        resumo += `${i.quantidade}x ${i.nome} — R$ ${i.subtotal.toFixed(2)}\n`;
    });
    resumo += `\nTotal: R$ ${valorTotal.toFixed(2)}\n\nProssiga com o pagamento para finalizar seu pedido.`;

    await Alerta(resumo);
}
//  ASSINAR PLANO 
 
async function assinarPlano(plano) {
    const msgs = {
        basico:  "Você escolheu o plano BÁSICO (R$39,90/mês). Em breve entraremos em contato! 💚",
        premium: "Plano PREMIUM selecionado (R$69,90/mês). Nossa equipe enviará os detalhes por e-mail. 🍃",
        familia: "Plano FAMÍLIA (R$99,90/mês) - Perfeito para compartilhar! Em instantes você receberá o link. 🌸"
    };
    await Alerta((msgs[plano] || "Plano selecionado!") + "\n\nPara agilizar, envie 'Quero assinar' para nosso WhatsApp (XX) XXXXX-XXXX.");
}
 
// ===== INICIALIZAÇÃO =====
renderizarListaChas();
 
document.getElementById("montarKitBtn").addEventListener("click", montarKit);
 
document.querySelectorAll(".btn-assinar").forEach(btn => {
    btn.addEventListener("click", (e) => {
        assinarPlano(e.currentTarget.getAttribute("data-plano"));
    });
});