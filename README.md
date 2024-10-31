# Gerador de Treinos

Um site estático que gera treinos personalizados com base nas preferências do usuário, selecionando exercícios aleatoriamente de um banco de dados no Firebase. O projeto inclui uma interface de administração para adicionar novos exercícios ao banco de dados.

## Descrição

Este projeto é um gerador de treinos que permite ao usuário especificar:

- Tempo disponível para o treino (em minutos)
- Nível do treino (Iniciante, Intermediário, Avançado)
- Categoria Etária (Todos, Criança, Adulto, Idoso)

Com base nas seleções, o site gera um treino personalizado, dividindo o tempo total em:

- **50%** Aquecimento
- **25%** Exercícios Práticos
- **25%** Finalização

Os exercícios são selecionados aleatoriamente do banco de dados do Firebase, respeitando as categorias, nível e categoria etária selecionados, além do tempo disponível.

## Funcionalidades

- **Gerador de Treinos Personalizados:** Cria treinos com base no tempo disponível, nível e categoria etária.
- **Divisão Proporcional do Tempo:** O tempo total é distribuído automaticamente entre aquecimento, exercícios práticos e finalização.
- **Seleção Aleatória de Exercícios:** Os exercícios são sorteados aleatoriamente para garantir variedade em cada treino.
- **Interface de Administração:** Área protegida por login para adicionar novos exercícios ao banco de dados.
- **Responsividade:** Layout adaptável para diferentes tamanhos de tela e dispositivos.
- **Estética Escura Moderna:** Design com tema escuro e cores em amarelo pastel para melhor visualização.

## Como Usar

### Acesse o Site:

- Visite a página hospedada no GitHub Pages.

### Gerar Treino:

1. Insira o tempo disponível para o treino (em minutos).
2. Selecione o nível do treino.
3. Escolha a categoria etária.
4. Clique em "Gerar Treino".

### Visualizar o Treino:

- O treino será exibido com a lista de exercícios divididos em Aquecimento, Exercícios Práticos e Finalização.
- Cada exercício inclui:
- Nome
- Duração (em minutos e/ou segundos)
- Explicação (se disponível)
- Impulso (se disponível)
- Repetições (se disponível)
- Séries (se disponível)

### Área de Administração (Opcional):

1. Clique no botão "Administrador" na página principal.
2. Faça login com as credenciais de administrador.
3. Adicione novos exercícios ao banco de dados preenchendo o formulário.