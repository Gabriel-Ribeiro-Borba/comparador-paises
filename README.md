# Comparador de Países

Projeto da faculdade feito com **React + Vite**. A aplicação permite escolher
alguns países e um indicador (PIB, população, inflação, etc.) e compara os
dados em gráficos e em uma tabela.

Os dados vêm da **API do Banco Mundial** (https://api.worldbank.org), que é
gratuita e não precisa de chave.

## Funcionalidades

- Lista com **todos os países** do mundo, buscada direto na API (com campo de busca)
- Escolher até 8 países ao mesmo tempo
- Mais de 35 indicadores separados por assunto: economia, população, saúde e educação, trabalho, energia e meio ambiente, tecnologia e defesa
- Escolher o período (de 1960 até 2024)
- Gráfico de linha com a evolução ao longo dos anos
- Gráfico de barras com o último valor de cada país
- Tabela com todos os valores
- Carregamento rápido: os dados já baixados ficam guardados (cache) e os pedidos à API são feitos todos ao mesmo tempo

## Tecnologias e bibliotecas

- React
- Vite (criado com `npm create vite@latest`)
- Recharts (gráficos) -> `npm install recharts`

## Como rodar o projeto

Precisa ter o Node.js instalado.

```bash
# 1. instalar as dependências
npm install

# 2. rodar em modo de desenvolvimento
npm run dev
```

Depois é só abrir o endereço que aparecer no terminal (geralmente http://localhost:5173).

Para gerar a versão de produção: `npm run build`

## Estrutura

```
src/
  App.jsx          -> componente principal (busca na API, cache e gráficos)
  dados/opcoes.js  -> lista de indicadores, cores e lista reserva de países
  index.css        -> estilos
  main.jsx         -> entrada do React
```

## Publicação

Aplicação publicada na Vercel: (colocar o link aqui)
