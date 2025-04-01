# Poker dos Cria

Sistema completo para gerenciamento de torneios de poker, desenvolvido com Next.js, Prisma e TypeScript.

## Funcionalidades

- Cadastro e gerenciamento de jogadores
- Criação e configuração de torneios
- Acompanhamento em tempo real de torneios em andamento
- Timer com alarme para controle de blinds
- Registro de reentradas
- Finalização de torneios com premiação
- Ranking de jogadores

## Tecnologias

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/) (Banco de dados)
- [Tailwind CSS](https://tailwindcss.com/) (Estilização)

## Pré-requisitos

- Node.js 18.17.0 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/poker-dos-cria-v2.git
cd poker-dos-cria-v2
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure o banco de dados:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

5. Acesse o sistema em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `src/app`: Páginas da aplicação (usando App Router do Next.js)
- `src/components`: Componentes React reutilizáveis
- `src/lib`: Funções de utilidade e acesso ao banco de dados
- `prisma`: Configuração do Prisma e definição do esquema de banco de dados

## Modelos de Dados

### Jogador

- ID
- Nome
- Chave Pix (opcional)
- Torneios participados
- Vitórias como 1º lugar
- Vitórias como 2º lugar

### Torneio

- ID
- Nome
- Data
- Buy-in
- Configurações de blinds
- Status (Configurado, Em Andamento, Finalizado)
- Jogadores participantes
- Vencedores

## Licença

MIT
