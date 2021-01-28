# Teste Agrotools

Este é o resultado do teste fullstack da Agrotools. 

## Sobre

O desafio é criar uma aplicação responsiva em que o usuário responde perguntas de um questionário, além de poder criar o seu próprio. Também é possível conferir as respostas de outros usuários. 

O servidor foi feito em Node.js e a API foi criada usando Express. O banco de dados é um mock que utiliza um arquivo `.json` para simular um DB. Tecnologias como React e Vue.js não foram usadas no front-end, como visto no enunciado do desafio. Também não foram utilizados bundlers, transpilers nem pré-processadores de estilo.

## Instruções

1. Clone o repositório e instale as dependências.

```
git clone
cd teste-agrotools
npm i
```

2. Com o servidor rodando, abra o arquivo index.html (pode usar uma ferramenta como _Live Server_ ou abrir diretamente o arquivo no navegador).

3. O projeto virá com um questionário já pronto, perguntando a localização do usuário. O usuário poderá criar o seu prórprio questionário com as perguntas que desejar.

## Endpoints

### /questions

Essa rota retorna todas os questionários cadastrados no DB. Opcionalmente pode-se informar o id do questionário para retornar apenas o questionário correspondente (ex: `/questions/1` retornará apenas o questionário de id "1").

### /answers

Endpoint que retorna todas as respostas gravadas no DB. Assim como para os questionários, pode-se informar o id de um questionário para receber todas as respostas a ele relacionadas (ex: `/answers/2` retornará as respostas que foram dadas para o questionário de id "2").