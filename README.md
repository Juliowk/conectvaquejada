# CONECTVAQUEJADA

Plataforma de comércio online especializada na comercialização e promoção responsável de ingressos para eventos de vaquejadas, oferecendo uma ampla variedade de opções de acesso às competições e festividades associadas a essa tradição cultural. Garantimos transações seguras e confiáveis, proporcionando aos entusiastas da vaquejada uma experiência conveniente e autêntica.

## Instalação

1. Clone o repositório: `git clone https://github.com/Juliowk/conectvaquejada.git`;
2. Navegue até o diretório do projeto;
3. Execute o comando de instalação de dependências: `npm install`;
4. Configure o arquivo `knexfile.js` como necessário:

```
module.exports = {
     client: 'mysql2',
     connection: {
          host: '127.0.0.1', // para localhost
          user: 'seu_usuario',
          password: 'sua_senha',
          database: 'seu_dadata_base'
     }
};
```

5. Execute o comando de migrão de tabelas para o seu bando mysql: `npx knex migrate:latest`;

#
### Júlio Elias de Sousa Rocha - `https://github.com/Juliowk`