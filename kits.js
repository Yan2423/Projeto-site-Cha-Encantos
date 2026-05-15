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

        // Renderiza a lista com checkbox + quantidade
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
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <input type="number" min="0" max="10" value="0" step="1" class="quantidade-input" data-nome="${cha.nome}" data-preco="${cha.preco}">
                        <span>unid.</span>
                    </div>
                `;
                container.appendChild(div);
            });

          
            document.querySelectorAll(".quantidade-input").forEach(input => {
                input.addEventListener("change", function() {
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

        function montarKit() {
            const itens = Object.keys(selecionados);
            if (itens.length === 0) {
                alert("Por favor, selecione pelo menos um chá e defina a quantidade > 0.");
                return;
            }
            let mensagem = " SEU KIT PERSONALIZADO:\n\n";
            for (let nome of itens) {
                const info = selecionados[nome];
                mensagem += `${info.quantidade}x ${nome} - R$ ${(info.preco * info.quantidade).toFixed(2)}\n`;
            }
            const total = Object.values(selecionados).reduce((acc, curr) => acc + (curr.preco * curr.quantidade), 0);
            mensagem += `\n Total: R$ ${total.toFixed(2)}\n\nEnvie esta mensagem para finalizar seu pedido pelo WhatsApp (XX) XXXXX-XXXX.`;
            alert(mensagem);
        }

      
        function assinarPlano(plano) {
            let mensagem = "";
            if (plano === "basico") mensagem = "Você escolheu o plano BÁSICO (R$39,90/mês). Em breve entraremos em contato para finalizar a assinatura! 💚";
            else if (plano === "premium") mensagem = "Plano PREMIUM selecionado (R$69,90/mês). Que delícia! Nossa equipe enviará os detalhes por e-mail. 🍃";
            else mensagem = "Plano FAMÍLIA (R$99,90/mês) - Perfeito para compartilhar! Em instantes você receberá o link de cadastro. 🌸";
            alert(mensagem + "\n\nPara agilizar, envie 'Quero assinar' para nosso WhatsApp (XX) XXXXX-XXXX.");
        }

        // Inicialização
        renderizarListaChas();
        document.getElementById("montarKitBtn").addEventListener("click", montarKit);
        document.querySelectorAll(".btn-assinar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const plano = e.currentTarget.getAttribute("data-plano");
                assinarPlano(plano);
            });
        });