# Chá & Encantos - Trabalho Programação Web

Projeto desenvolvido para a disciplina de  Programação Web. Um site informativo sobre chás, com catálogo, recomendações personalizadas por clima, montagem de kits, assinaturas mensais, depoimentos e dicas de saúde.

---

## Integrantes do Grupo

- **Yan Magnum**
- **Ana Clara**
- **Isael Canuto**
- **Gabriel Kauã**

---


---

## 🌦️ Como fazer a API de clima funcionar

O site utiliza a **API gratuita Open-Meteo** para recomendar chás com base na temperatura da sua região. Para funcionar corretamente, é necessário **permitir o acesso à localização** no navegador.

### Passo a passo:

#### 1. Abrir o site no navegador
Acesse qualquer página que contenha a seção **"Recomendação do Dia"** (index.html ou catalogo.html).

#### 2. Permitir localização
O navegador solicitará permissão para acessar sua localização. Clique em **"Permitir"** ou **"Allow"**.

> ⚠️ **Importante:** Se clicar em "Bloquear", a funcionalidade não funcionará.

#### 3. Como permitir manualmente (caso tenha bloqueado sem querer)

| Navegador | Como reativar |
|-----------|----------------|
| **Google Chrome** | Clique no ícone de cadeado 🔒 ao lado da URL → Configurações do site → Permitir localização → Recarregue a página (F5) |
| **Mozilla Firefox** | Clique no ícone de escudo 🛡️ ou 🔒 na barra de endereço → Limpar configurações → Recarregue a página |
| **Microsoft Edge** | Clique no ícone de cadeado 🔒 → Permissões do site → Permitir localização → Recarregue a página |
| **Opera** | Clique no ícone de cadeado 🔒 → Permitir localização → Recarregue a página |

#### 4. Verificar se funcionou
Após permitir, o widget exibirá algo como:
> *"23°C agora | Dia ameno: Experimente estes chás..."*

---

## 🧪 Testar sem geolocalização

Se quiser testar sem conceder localização (ou estiver em um ambiente restrito), o site exibirá a mensagem:

> *"Permita localização para receber recomendações do clima."*

A funcionalidade de recomendação climática é um **diferencial**, mas o site continua totalmente funcional sem ela.

---

## 🛠️ Tecnologias utilizadas

- **HTML5** – Estrutura das páginas
- **CSS3** – Estilização e responsividade
- **JavaScript** – Lógica, validação de formulário, filtro de preço e consumo da API
- **Open-Meteo API** – Dados climáticos gratuitos (sem necessidade de chave de API)

---

## ▶️ Como executar o projeto localmente

1. Baixe ou clone este repositório
2. Certifique-se de que todos os arquivos estão na mesma pasta
3. Abra o arquivo `index.html` diretamente no navegador (não é necessário servidor)

> 💡 **Dica:** Para evitar problemas com arquivos locais, utilize a extensão **Live Server** do VS Code.

---

## 📝 Observações finais

- O formulário de contato está em **modo de demonstração** – não envia e-mails reais
- As imagens e logos utilizadas são ilustrativas
- A API de clima é **gratuita** e não requer cadastro ou chave de acesso

---



