# Desafio Fast — Rastreamento de Participação em Workshops

Projeto desenvolvido para o Desafio Técnico de Estágio FullStack da Fast Soluções. O objetivo é rastrear a participação de colaboradores em workshops trimestrais, através de uma API REST (Backend) e uma interface web (Frontend).

---

## 🔧 Backend

API REST desenvolvida em **C# (.NET 10)**, responsável por gerenciar colaboradores, workshops e o registro de presença entre eles.

### Tecnologias utilizadas

- **C# / ASP.NET Core** — linguagem e framework da API
- **Entity Framework Core** — ORM para acesso ao banco de dados
- **SQL Server (Express)** — banco de dados relacional
- **JWT (JSON Web Token)** — autenticação e autorização
- **Swagger (Swashbuckle)** — documentação interativa da API

### Arquitetura

O projeto segue uma arquitetura em camadas, separando responsabilidades:

```
Controller → Service → Repository → Banco de Dados
```

- **Controllers** — recebem as requisições HTTP e delegam o processamento
- **Services** — concentram as regras de negócio e validações
- **Repositories** — responsáveis pelo acesso aos dados (via Entity Framework Core)
- **Models** — representam as entidades do domínio (`Colaborador`, `Workshop`)

### Estrutura de pastas

```
backend/
└── FastChallenge.Api/
    ├── Controllers/
    │   ├── AuthController.cs
    │   ├── ColaboradoresController.cs
    │   └── WorkshopsController.cs
    ├── Models/
    │   ├── Colaborador.cs
    │   ├── Workshop.cs
    │   └── LoginRequest.cs
    ├── Services/
    │   ├── IColaboradorService.cs / ColaboradorService.cs
    │   └── IWorkshopService.cs / WorkshopService.cs
    ├── Repositories/
    │   ├── IColaboradorRepository.cs / ColaboradorRepository.cs
    │   └── IWorkshopRepository.cs / WorkshopRepository.cs
    ├── Data/
    │   └── AppDbContext.cs
    ├── appsettings.json
    └── Program.cs
```

### Funcionalidades implementadas

**CRUD completo:**
- `GET / GET{id} / POST / PUT / DELETE` em `/api/colaboradores`
- `GET / GET{id} / POST / PUT / DELETE` em `/api/workshops`

**Rastreamento de presença:**
- `POST /api/workshops/{id}/colaboradores/{colaboradorId}` — registra a presença de um colaborador em um workshop
- `DELETE /api/workshops/{id}/colaboradores/{colaboradorId}` — remove a presença registrada

**Validações de negócio:**
- Nome de colaborador/workshop obrigatório (mínimo de 2 e máximo de 100 caracteres)
- Data de realização do workshop obrigatória
- Verificação de existência do colaborador antes de registrar presença

**Bônus implementados:**
- ✅ Persistência com banco de dados relacional (SQL Server + Entity Framework Core)
- ✅ Autenticação e autorização via JWT
- ✅ Documentação interativa via Swagger (com suporte a autenticação JWT)

### Como rodar o projeto localmente

**Antes de começar, é preciso ter instalado:**
- O .NET SDK 10, disponível para download no site oficial da Microsoft
- O SQL Server Express, também disponível no site oficial da Microsoft
- Opcionalmente, o SQL Server Management Studio (SSMS), que permite visualizar o banco de dados e suas tabelas de forma gráfica

**Passo 1 — Obter o projeto**

Baixe ou clone este repositório para o seu computador. O projeto da API fica dentro da pasta `backend/FastChallenge.Api`. É essa pasta específica — não a pasta `backend` sozinha, nem a raiz do repositório — que vamos chamar de "pasta do projeto" daqui em diante, já que é onde ficam o arquivo `Program.cs`, o `appsettings.json` e todo o código da API.

**Passo 2 — Configurar a conexão com o banco de dados**

Dentro da pasta do projeto (`backend/FastChallenge.Api`), existe um arquivo chamado `appsettings.json`, que guarda as configurações da aplicação. Nele, há uma seção chamada `ConnectionStrings`, que informa à API onde encontrar o banco de dados.

Por padrão, o projeto está configurado para se conectar a uma instância local do SQL Server chamada `SQLEXPRESS` — que é o nome padrão quando se instala a versão Express. Se a sua instalação tiver um nome diferente, esse é o ponto onde ele precisa ser ajustado, substituindo o nome do servidor pelo nome da sua própria instância.

**Passo 3 — Criar as tabelas no banco de dados**

O projeto usa uma ferramenta chamada Entity Framework Core, que sabe criar automaticamente todas as tabelas necessárias no banco de dados, a partir das classes já definidas no código (Colaborador, Workshop, etc.). Esse processo se chama "aplicar as migrations".

Para isso, abra um terminal **dentro da pasta do projeto** (`backend/FastChallenge.Api` — o mesmo local do Passo 1 e 2) e execute o comando `dotnet ef database update`. Esse comando vai se conectar ao SQL Server (usando as informações do Passo 2), criar o banco de dados chamado `FastChallengeDB` (caso ele ainda não exista) e criar dentro dele todas as tabelas necessárias para a aplicação funcionar.

**Passo 4 — Rodar a aplicação**

Ainda no terminal, **na mesma pasta do projeto** (`backend/FastChallenge.Api`), execute o comando `dotnet run`. Isso vai compilar e iniciar a API. Quando ela estiver pronta, o terminal vai exibir uma mensagem informando o endereço em que ela está rodando, geralmente algo como `http://localhost:5123`.

**Passo 5 — Acessar a documentação da API**

Com a aplicação rodando, abra o navegador e acesse o endereço mostrado no terminal, adicionando `/swagger` no final (por exemplo, `http://localhost:5123/swagger`). Essa página mostra todos os endpoints disponíveis na API, e permite testar cada um deles diretamente pelo navegador.

### Como autenticar e testar os endpoints

1. Faça login pelo endpoint `POST /api/auth/login`, usando as credenciais:
   ```json
   {
     "usuario": "admin",
     "senha": "123456"
   }
   ```
2. Copie o token retornado. Ele aparece na resposta entre aspas, no formato `"token": "eyJhbGciOiJIUzI1NiIs..."` — copie **apenas o texto que está dentro das aspas** (o token em si), sem incluir as aspas.
3. No Swagger, clique no botão **"Authorize"** (canto superior direito) e cole o token no formato:
   ```
   Bearer {seu_token_aqui}
   ```
4. Agora é possível testar todos os endpoints de `/api/colaboradores` e `/api/workshops`.

> ⚠️ **Nota:** o usuário/senha estão fixos no código, como uma simplificação proposital para este desafio (ver seção "Uso de IA" abaixo). Em um cenário de produção, isso seria substituído por uma tabela de usuários com senhas criptografadas.

---

## 🎨 Frontend

*(Seção a ser preenchida na próxima etapa do desafio.)*

---

## 🤖 Uso de Inteligência Artificial

Utilizei o Claude (Anthropic) como apoio durante todo o desenvolvimento do backend — para tirar dúvidas conceituais, revisar decisões de arquitetura e resolver problemas pontuais. Abaixo, destaco os momentos em que a IA influenciou decisões técnicas relevantes, com o contexto e a escolha final que tomei.

### 1. Como representar a presença de colaboradores em um workshop

**Contexto:** era preciso decidir como modelar, no código, quais colaboradores participaram de cada workshop.

**Prompt usado (resumido):** perguntei se seria melhor usar uma lista simples de colaboradores dentro da classe `Workshop`, ou criar uma classe própria (`Presenca`/`WorkshopColaborador`) para representar esse vínculo.

**Decisão tomada:** optei pela lista simples (`List<Colaborador>` dentro de `Workshop`), já que o desafio só exige saber se o colaborador esteve ou não presente — sem necessidade de dados adicionais, como horário de chegada ou status de confirmação. Criar uma classe separada para isso seria complexidade desnecessária (over-engineering) para o escopo do projeto.

### 2. Bug de persistência entre requisições (Repository em memória)

**Contexto:** antes de implementar o banco de dados, os dados dos Repositories eram guardados em uma lista em memória. Um colaborador criado via `POST` não aparecia depois em um `GET`, mesmo sem reiniciar a aplicação.

**Prompt usado (resumido):** relatei o comportamento (dado sumia entre requisições) e pedi ajuda para diagnosticar a causa.

**Decisão tomada:** identificamos que o Repository estava registrado como `AddScoped` na injeção de dependência, o que cria uma nova instância a cada requisição HTTP. Troquei para `AddSingleton`, garantindo que a mesma lista em memória fosse compartilhada entre todas as requisições enquanto a aplicação estivesse rodando.

### 3. Escolha do banco de dados

**Contexto:** o desafio permite usar MySQL ou SQL Server como banco relacional.

**Prompt usado (resumido):** pedi uma comparação entre as opções, considerando que meu backend é em C#/.NET e que eu não tinha nenhum dos dois instalado.

**Decisão tomada:** optei por SQL Server Express, pela integração nativa com o ecossistema .NET (driver mantido pela própria Microsoft) e pela disponibilidade de ferramentas visuais (SSMS) para inspecionar o banco durante o desenvolvimento.

### 4. Regras de validação de negócio

**Contexto:** decidi adicionar validações além do mínimo exigido pelo desafio, para reforçar a robustez da API.

**Prompt usado (resumido):** pedi sugestões de validação para nome (tamanho mínimo/máximo) e data de realização do workshop.

**Decisão tomada:** implementei validação de nome obrigatório (2 a 100 caracteres) para colaboradores e workshops, e tornei a data de realização do workshop obrigatória — mas optei por **não bloquear datas no passado**, já que pode ser útil cadastrar workshops que já ocorreram, para fins de histórico.

---

## 📋 Critérios atendidos

- ✅ Funcionalidade — CRUD completo de Colaboradores e Workshops, com rastreamento de presença
- ✅ Estrutura do código — arquitetura em camadas (Controller/Service/Repository), Clean Code
- ✅ Bônus — Banco de dados relacional, Autenticação JWT, Documentação Swagger