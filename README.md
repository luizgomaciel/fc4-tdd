`Desafio TDD - Test Driven Development`

```Rodar local como Node```

Instalar o node
https://nodejs.org/pt/download

Executar os comandos:
1. npm install
2. npm test

```Rodar com imagem docker```

Instalar docker desktop
https://docs.docker.com/get-started/introduction/get-docker-desktop/

Build imagem e executar docker

1. docker build -t local/tdd-fc:0.0.1 .
2. docker run -it -d --rm --name tdd-dc -v "$(pwd)/":/app/ local/tdd-fc:0.0.1
3. docker exec -it tdd-dc  /bin/bash

Dentro da imagem executar

1. npm install
2. npm test





