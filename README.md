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


2. Garanta que o [**Node.js**](https://nodejs.org/en/download/) está instalado em sua máquina e então habilite o gerenciador de pacotes `yarn`.

3. Acesse a pasta do projeto com seu terminal.

4. Rode o comando `yarn` para instalar as dependências do projeto.

5. Inicie o [**Docker**](https://www.docker.com/) em sua máquina.

6. Para iniciar o banco de dados PostgreSQL, rode o comando.
```bash
yarn docker:up
```

7. Faça as migrações no banco de dados.
```bash
yarn migrate
```

8. Rode o comando `yarn build` para transpilar o código typescript para javascript.

9. Rode a aplicação com o comando `yarn start`. Você deve receber a seguinte mensagem de confirmação:
```bash
Server running at http://localhost:<port>
```

10.  Para visualizar a documentação com as rotas disponíveis, acesse `localhost:<port>/api/docs`.

## Variáveis de ambiente

⚠️ É imprescindível que todas as variáveis estejam devidamente configuradas. ⚠️

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

1. Entre nas configurações de segurança da sua conta do Gmail.
2. Procure pela opção de "Verificação em duas etapas" e ative ela.
3. Ainda na aba de Verificação em duas etapas, procure por "Senhas de app".
4. Selecione o app, escolha um nome e clique em gerar.
5. No fim terá uma senha gerada. Só copiar e usar nas credenciais do `MAIL_PASS`.


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
1. Create a copy of the file `.env.example` with the name `.env`. In this file, replace the values for the variables with your favorite `localhost` port, the user name and password for the PostgreSQL database.

> The app will only work properly if these data are correctly set in `.env` file.

2. Ensure that [**Node.js**](https://nodejs.org/en/download/) is installed on your machine and then enable the `yarn`.

3. Access the project root folder on your terminal.

4. Run `yarn` command to install the project dependencies.

5. Start [**Docker**](https://www.docker.com/) on your machine.

6. To start the PostgreSQL database, run the command:
```bash
yarn docker:up
```

7. Perform database migrations.

```bash
yarn migrate
```

8. Run `yarn build` to "transpile" typescript code to javascript.

9. Run `yarn start` on your terminal to start application. You should receive the following message:

```bash
Server running at http://localhost:<port>}
```

10. To view the documentation with the available routes, access `localhost:<port>/api/docs`.

## Environment variables

⚠️ It is necessary that all variables are properly configured. ⚠️

`NODE_ENV`: This variable define which environment the application is running. Example: `NODE_ENV=development`.

---
Variables related to database settings. As an example are the default values for development.


`POSTGRES_USER`: Postgres user. Example: `POSTGRES_USER=admin`.

`POSTGRES_PASSWORD`: Postgres password. Exemple: `POSTGRES_PASSWORD=admin`.

`POSTGRES_DB`: Database name. Exemple: `POSTGRES_DB=database`.

`PG_HOST`: Database address. Exemple: `PG_HOST=localhost`.

`PG_PORT`: Database port. Exemple: `PG_PORT=54320`.

`DATABASE_URL`: Url provided by database providers. Exemple `DATABASE_URL="postgresql://admin:admin@localhost:54320/database?schema=public"`

---
Variables related to settings by third party services.

`PORT`: Application port. Exemple: `PORT=3333`.

`SALT`: Value related to Bcrypt encryption algorithm settings. Exemple: `SALT=12`.

`SECRET`: Secret key to creation of JWT. Exemple: `SECRET=supersecretkey`.

`EXPIRY_TIME_SECONDS`: Expiry time seconds to password recovery code. Exemple `EXPIRY_TIME_SECONDS=3000`.

`MAIL_SERVICE`: Provedor do serviço de email, relacionada à biblioteca de envio de email. Exemple: `MAIL_SERVICE="gmail"`.

`MAIL_USER`: E-mail used by the library. Exemple: `MAIL_USER="mail_user@mail.com"`.

`MAIL_PASS`: *Credentials provided by the email provider. Exemple: `MAIL_PASS="mail_pass"`.

---

\* Example of how to get `MAIL_PASS` in email provider Gmail:
1. Enter the security settings of your Gmail account.
2. Look for the "Two-Step Verification" option and enable it.
3. After that, still on the 2-Step Verification tab, look for "App Password".
4. Select the app, choose a name and click generate.
5. At the end you will have a password generated. Just copy and use the `MAIL_PASS` credentials.

<a href='#top'>🔼 Back to top</a>

---
