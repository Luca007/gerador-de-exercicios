# Gerador de Treinos

Um site estático que gera treinos personalizados com base nas preferências do usuário, selecionando exercícios aleatoriamente de um banco de dados no Firebase. O projeto inclui uma interface de administração para adicionar e gerenciar exercícios no banco de dados.

## Acessar o Projeto

Você pode acessar o projeto através do link:

[https://luca007.github.io/gerador-de-exercicios/](https://luca007.github.io/gerador-de-exercicios/)

## Descrição

Este projeto é um gerador de treinos que permite ao usuário especificar:

- Tempo disponível para o treino (em minutos)
- Nível do treino (Todos, Iniciante, Intermediário, Avançado)
- Categoria Etária (Todos, Criança, Adulto, Idoso)

Com base nas seleções, o site gera um treino personalizado, dividindo o tempo total em:

- **10%** Aquecimento
- **20%** Fortalecimento
- **20%** Alongamento
- **35%** Exercícios com Equipamentos
- **15%** Aeróbico

Os exercícios são selecionados aleatoriamente do banco de dados do Firebase, respeitando as categorias, nível e categoria etária selecionados, além do tempo disponível.

## Funcionalidades

- **Gerador de Treinos Personalizados:** Cria treinos com base no tempo disponível, nível e categoria etária.
- **Divisão Proporcional do Tempo:** O tempo total é distribuído automaticamente entre as diferentes categorias de exercícios.
- **Seleção Aleatória de Exercícios:** Os exercícios são sorteados aleatoriamente para garantir variedade em cada treino.
- **Interface de Administração:** Área protegida por login para adicionar, editar e remover exercícios do banco de dados.
- **Responsividade:** Layout adaptável para diferentes tamanhos de tela e dispositivos.
- **Tema Escuro Moderno:** Design com tema escuro e cores em amarelo pastel para melhor visualização.
- **Animação de Carregamento Personalizada:** Loader animado exibido durante a geração do treino.

## Como Usar

### Acesse o Site

- Visite a página hospedada no GitHub Pages: [Gerador de Treinos](https://luca007.github.io/gerador-de-exercicios/)

### Gerar Treino

1. Insira o tempo disponível para o treino (em minutos).
2. Selecione o nível do treino.
3. Escolha a categoria etária.
4. Clique em "Gerar Treino".

### Visualizar o Treino

- O treino será exibido com a lista de exercícios divididos nas categorias correspondentes.
- Cada exercício inclui detalhes como:
- Nome
- Duração
- Explicação (se disponível)
- Repetições (se disponível)
- Séries (se disponível)

### Área de Administração (Opcional)

1. Clique no botão "Administrador" na página principal.
2. Faça login com as credenciais de administrador.
3. Adicione, edite ou remova exercícios ao banco de dados preenchendo o formulário.

## Tecnologias Utilizadas

- **HTML5 e CSS3:** Estrutura e estilização da página.
- **JavaScript ES6+:** Lógica do aplicativo e manipulação do DOM.
- **Firebase Firestore:** Banco de dados NoSQL para armazenar exercícios.
- **Firebase Authentication:** Autenticação de usuários para a área de administração.
- **Bootstrap 4:** Framework CSS para layout responsivo e componentes visuais.
- **jQuery:** Biblioteca JavaScript para manipulação do DOM.

## Estrutura do Projeto

- `index.html`: Página principal com o formulário para gerar treinos.
- `styles.css`: Estilos personalizados para o tema escuro.
- `loader.css`: Estilos para a animação de carregamento personalizada.
- `main.js`: Arquivo principal que importa os outros módulos JavaScript.
- `treino.js`: Contém a lógica para gerar e exibir os treinos.
- `exercicio.js`: Gerencia a interface de administração dos exercícios.
- `admin.js`: Lida com o login e interface administrativa.
- `utils.js`: Funções utilitárias usadas em todo o projeto.
- `auth.js`: Monitoramento do estado de autenticação.
- `firebase.js`: Configuração e inicialização do Firebase.

## Como Configurar Localmente

1. **Clone o Repositório:**

     ```bash
     git clone https://github.com/luca007/gerador-de-exercicios.git
     ```

2. **Instale as Dependências:**

     - Como este é um site estático, não há dependências de backend.
     - Certifique-se de incluir o SDK do Firebase em seu projeto.

3. **Configure o Firebase:**

     - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
     - Substitua as configurações em `firebase.js` pelas suas configurações do Firebase.

4. **Inicie o Projeto:**

     - Abra o `index.html` em um navegador web.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.
