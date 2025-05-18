# Nerd Rats API

API para coleta e consulta de métricas de uso do Nerd Rats.

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
     ```
     PORT=5000 # Porta opcional, padrão é 5000
     SUPABASE_URL=sua_url_do_supabase
     SUPABASE_KEY=sua_chave_do_supabase
     ```

## Endpoints

### POST /metrics
Registra ou atualiza métricas de um usuário.

**Body:**
```json
{
    "user_github": "string",
    "email": "string",
    "quant_clicks": number,
    "quant_dist": number,
    "quant_scrow": number,
    "quant_keys": number
}
```

**Respostas:**
- 200: Métricas registradas com sucesso
- 400: Dados inválidos
- 500: Erro interno do servidor

### GET /user-by-email/:email
Retorna os dados do usuário pelo email.

**Parâmetros:**
- `email`: Email do usuário

**Respostas:**
- 200: Dados do usuário
- 500: Erro interno do servidor

### GET /user-rank-clicks/:user_github
Retorna a posição do usuário no ranking de cliques.

**Parâmetros:**
- `user_github`: Nome de usuário do GitHub

**Respostas:**
- 200: Posição do usuário no ranking
- 500: Erro interno do servidor

### GET /rank-clicks
Retorna o top 10 usuários com mais cliques.

**Respostas:**
- 200: Lista dos top 10 usuários
- 500: Erro interno do servidor

### GET /user-rank-dist/:user_github
Retorna a posição do usuário no ranking de distância percorrida.

**Parâmetros:**
- `user_github`: Nome de usuário do GitHub

**Respostas:**
- 200: Posição do usuário no ranking
- 500: Erro interno do servidor

### GET /rank-dist
Retorna o top 10 usuários com maior distância percorrida.

**Respostas:**
- 200: Lista dos top 10 usuários
- 500: Erro interno do servidor

### GET /user-rank-scrow/:user_github
Retorna a posição do usuário no ranking de scroll.

**Parâmetros:**
- `user_github`: Nome de usuário do GitHub

**Respostas:**
- 200: Posição do usuário no ranking
- 500: Erro interno do servidor

### GET /rank-scrow
Retorna o top 10 usuários com mais scroll.

**Respostas:**
- 200: Lista dos top 10 usuários
- 500: Erro interno do servidor

### GET /user-rank-keys/:user_github
Retorna a posição do usuário no ranking de teclas pressionadas.

**Parâmetros:**
- `user_github`: Nome de usuário do GitHub

**Respostas:**
- 200: Posição do usuário no ranking
- 500: Erro interno do servidor

### GET /rank-keys
Retorna o top 10 usuários com mais teclas pressionadas.

**Respostas:**
- 200: Lista dos top 10 usuários
- 500: Erro interno do servidor

## Tecnologias Utilizadas

- Fastify
- Supabase
- Node.js
- CORS

## Executando o Projeto

```bash
npm start
```

O servidor estará disponível em `http://localhost:5000` (ou na porta especificada no arquivo .env). 