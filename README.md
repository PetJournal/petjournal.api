<div id='top'>

# Pet Journal

</div>

_[Read it in English](#English)_

API da plataforma Pet Journal que te ajuda a cuidar do teu pet.

<div>
  <img src="https://img.shields.io/badge/TypeScript-F7DF1E?style=for-the-badge&logo=typescript&logoColor=black">
  <img src="https://img.shields.io/badge/node-233056?style=for-the-badge&logo=node.js&logoColor=339933">
  <img src="https://img.shields.io/badge/express-eeeeee?style=for-the-badge&logo=express&logoColor=000000">
  <img src="https://img.shields.io/badge/docker-blue?style=for-the-badge&logo=docker&logoColor=ffffff">
  <img src="https://img.shields.io/badge/prisma-676767?style=for-the-badge&logo=prisma&logoColor=cccccc">
  <img src="https://img.shields.io/badge/postgresql-blue?style=for-the-badge&logo=postgresql&logoColor=ffffff"/>
  <img src="https://img.shields.io/badge/jest-ff4545?style=for-the-badge&logo=jest&logoColor=ffffff">
  <img src="https://img.shields.io/badge/swagger-green?style=for-the-badge&logo=swagger&logoColor=">
</div>

## ⚙️ Como usar

0. Faça o download deste repositório através do botão verde **Code** no topo da página e, em seguida, clicando em **Download ZIP**. Ou, se preferir, através do terminal (Git Bash, Powershell, etc.), use o comando:

```bash
git clone https://github.com/PetJournal/petjournal.api.git
```

1. Crie uma cópia do arquivo `.env.example` com o nome `.env`. Neste arquivo, substitua os valores das variáveis pela porta de sua preferência para o `localhost`, além do nome de usuário e senha do seu banco de dados PostgreSQL.
> A aplicação só funcionará com esses dados corretamente inseridos no arquivo `.env`.

2. Inicie o [Docker](https://www.docker.com/) em sua máquina;

3. Para iniciar o banco de dados PostgreSQL, rode o comando:
```bash
docker compose -f docker-compose.dev.yml up -d
```

4. Garanta que o [**Node.js**](https://nodejs.org/en/download/) está instalado em sua máquina e então habilite o gerenciador de pacotes yarn usando o comando `corepack enable`;

5. Acesse a pasta do projeto com seu terminal;

6. Rode o comando `yarn` para instalar as dependências do projeto;

7. Faça as migrações no banco de dados;
```bash
npx prisma migrate dev
```

8. Rode o comando `yarn build` para transpilar o código typescript para javascript;

9. Após a correta configuração acima, rode a aplicação com o comando `yarn start`. Você deve receber a seguinte mensagem de confirmação:
```bash
Server running at http://localhost:<porta>
```

10. Para visualizar a documentação com as rotas disponíveis, acesse `localhost:<porta>/api/docs`.

## Variáveis de ambiente

`NODE_ENV`: Essa variável define o ambiente que a aplicação está sendo executada. Exemplo: `NODE_ENV=development`.

---
Variáveis relacionadas as configurações do banco de dados. Como exemplo são os valores padrões para o desenvolvimento.

`POSTGRES_USER`: Usuário do Postgres. Exemplo: `POSTGRES_USER=admin`.

`POSTGRES_PASSWORD`: Senha do Postgres. Exemplo: `POSTGRES_PASSWORD=admin`.

`POSTGRES_DB`: Nome do banco de dados. Exemplo: `POSTGRES_DB=database`.

`PG_HOST`: Endereço do BD. Exemplo: `PG_HOST=localhost`.

`PG_PORT`: Porta do BD. Exemplo: `PG_PORT=54320`.

`DATABASE_URL`: Url fornecida pelos provedores. Exemplo `DATABASE_URL="postgresql://admin:admin@localhost:54320/database?schema=public"`

---
Variáveis relacionadas as configurações de serviços externos.

`PORT`: Porta da aplicação. Exemplo: `PORT=3333`.

`SALT`: Valor relacionado ao algoritmo de encriptação do Bcrypt. Exemplo: `SALT=12`.

`SECRET`: Chave secreta para a criação do token jwt. Exemplo: `SECRET=supersecretkey`.

`EXPIRY_TIME_SECONDS`: Tempo de expiração em segundos para o código de recuperação de senha. Exemplo `EXPIRY_TIME_SECONDS=3000`.

`MAIL_SERVICE`: Provedor do serviço de email, relacionada à biblioteca de envio de email. Exemplo: `MAIL_SERVICE="gmail"`.

`MAIL_USER`: Email utilizado pela biblioteca. Exemplo: `MAIL_USER="mail_user@mail.com"`.

`MAIL_PASS`: *Credenciais fornecidas pelo provedor de email. Exemplo: `MAIL_PASS="mail_pass"`.

---

\* Exemplo de como obter o `MAIL_PASS` no provedor de email Gmail:
1. Clica na sua foto no canto e vá em "Gerenciar sua conta do Google".
2. Na esquerda clique em "segurança".
3. Procure pela opção de "Verificação em duas etapas" e ative ela,
4. após isso ainda na aba de Verificação em duas etapas, procure por "Senha de app".
5. Selecione o app, escolha um nome e clique em gerar.
6. No fim terá uma senha gerada. Só copiar e usar nas credenciais do `MAIL_PASS`.


<a href='#top'>🔼 Voltar ao topo</a>

---

<div id="English">

_English version_

</div>

## 🔎 Overview

API of the Pet Journal platform that helps you take care of your pet.

## ⚙️ How to use it

0. Download this repository by clicking the green **Code** button on top of the page and then clicking **Download ZIP** option. Or use the following command on your terminal (Git Bash, Powershell, etc.):

```bash
git clone https://github.com/PetJournal/petjournal.api.git
```
1. Create a copy of the file `.env.example` with the name `.env`. In this file, replace the values for the variables with your favorite localhost port, the user name and password for the PostgreSQL database.

> The app will only work properly if these data are correctly set in `.env` file.

2. Start [Docker](https://www.docker.com/) on your machine;

3. To start the PostgreSQL database, run the command:
```bash
docker compose -f docker-compose.dev.yml up -d
```

4. Ensure that [**Node.js**](https://nodejs.org/en/download/) is installed on your machine and then enable the `yarn` package manager using the `corepack enable` command;

5. Access the project root folder on your terminal;

6. Run the `yarn` command to install the project dependencies;

7. To start the application, run `yarn dev` on your terminal. You should receive the following message:

```bash
Server running at http://localhost:<port>}
```

8. To view the documentation with the available routes, access `localhost:<port>/api/docs`.

<a href='#top'>🔼 Back to top</a>

---
