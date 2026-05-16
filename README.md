# Chá & Encantos - Trabalho Programação Web

Projeto desenvolvido para a disciplina de Programação Web. Um site informativo sobre chás, com catálogo, recomendações personalizadas por clima, montagem de kits, assinaturas mensais, depoimentos e dicas de saúde.

---

## Integrantes do Grupo

- **Yan Magnum**
- **Ana Clara**
- **Isael Canuto**
- **Gabriel Kauã**

---

## 📁 Estrutura do Projeto

```
cha-encantos/
├── backend/
│   ├── api.py
│   ├── database.py
│   ├── cha_encantos.db
│   └── requirements.txt
│
├── docs/
│   │   ├── index.html
│   │   ├── sobre.html
│   │   ├── catalogo.html
│   │   ├── kits.html
│   │   └── contato.html
│   ├── admin/
│   │   ├── admin.html
│   │   └── ADMstyles.css
│   ├── assets/
│   │   └── flor-logo.png
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── script.js
│       └── kits.js
│
└── README.md
```

---

## ▶️ Como executar o projeto localmente

### 1. Instalar as dependências do backend

Certifique-se de ter o **Python 3** instalado. Depois, abra o terminal na pasta `backend/` e rode:

```bash
pip install flask flask-cors
```

### 2. Iniciar a API

Ainda na pasta `backend/`, execute:

```bash
python api.py
```

Você verá no terminal:
```
✅ Banco de dados inicializado com sucesso!
🌐 API rodando em: http://localhost:5000
```

> ⚠️ **Deixe esse terminal aberto** enquanto usar o site. Se fechar, a API para de funcionar.

### 3. Abrir o site

Abra um **segundo terminal** na pasta `backend/` e rode:

```bash
python -m http.server 8000
```

Depois acesse no navegador: **http://localhost:8000/frontend/pages/index.html**

> 💡 Usar o servidor local evita erros de CORS ao enviar formulários.

---

## 🔌 Rotas da API

A API roda em `http://localhost:5000` e possui as seguintes rotas:

### Verificar se a API está online
```
GET /api/health
```

### Formulário de contato
```
POST /api/contato
```
Body (JSON):
```json
{
  "nome": "Seu Nome",
  "email": "email@exemplo.com",
  "mensagem": "Sua mensagem aqui"
}
```


---

## 👑 Painel Administrativo

Com a API rodando, abra no navegador:

```
frontend/admin/admin.html
```

No painel você pode:
- Ver todas as mensagens recebidas pelo formulário de contato
- Marcar mensagens como lidas
- Deletar mensagens
- Ver estatísticas (total, lidas e não lidas)

---

## 🌦️ Como fazer a API de clima funcionar

O site utiliza a **API gratuita Open-Meteo** para recomendar chás com base na temperatura da sua região. Para funcionar, é necessário **permitir o acesso à localização** no navegador quando solicitado.

Caso tenha bloqueado por engano:

| Navegador | Como reativar |
|-----------|---------------|
| **Chrome** | Cadeado 🔒 na URL → Configurações do site → Permitir localização → F5 |
| **Firefox** | Escudo 🛡️ na URL → Limpar configurações → F5 |
| **Edge** | Cadeado 🔒 na URL → Permissões do site → Permitir localização → F5 |

---

## 🛠️ Tecnologias utilizadas

- **HTML5** – Estrutura das páginas
- **CSS3** – Estilização e responsividade
- **JavaScript** – Lógica, validação de formulário, filtro de preço e consumo de APIs
- **Python + Flask** – API backend para receber mensagens e pedidos
- **SQLite** – Banco de dados local
- **Open-Meteo API** – Dados climáticos gratuitos (sem chave de acesso)

---

## 📝 Observações finais

- O formulário de contato **envia de verdade** para o banco de dados quando a API está rodando
- As mensagens podem ser visualizadas no painel admin (`frontend/admin/admin.html`)
- A API de clima é gratuita e não requer cadastro


