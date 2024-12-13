# Gerador de Treinos

Um site estático que gera treinos personalizados com base nas preferências do usuário, selecionando exercícios aleatoriamente de um banco de dados no Firebase. O projeto inclui uma interface de administração para adicionar e gerenciar exercícios no banco de dados, permitindo o controle completo sobre os exercícios disponíveis.

## Acessar o Projeto

Você pode acessar o projeto através do link:

[https://luca007.github.io/gerador-de-exercicios/](https://luca007.github.io/gerador-de-exercicios/)

## Sumário

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Como Usar](#como-usar)
- [Gerar Treino](#gerar-treino)
- [Área de Administração](#área-de-administração)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Configurar Localmente](#como-configurar-localmente)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Descrição

Este projeto é um gerador de treinos que permite ao usuário especificar parâmetros para montar um treino personalizado:

- **Tempo disponível para o treino** (em minutos)
- **Nível do treino** (Todos, Iniciante, Intermediário, Avançado)
- **Categoria Etária** (Todos, Criança, Adulto, Idoso)

Com base nas seleções, o site gera um treino personalizado, dividindo o tempo total de forma proporcional entre diferentes categorias de exercícios. Os exercícios são selecionados aleatoriamente do banco de dados do Firebase, respeitando as categorias, nível e categoria etária selecionados, além do tempo disponível.

## Funcionalidades

- **Gerador de Treinos Personalizados:** Cria treinos com base no tempo disponível, nível e categoria etária do usuário.
- **Divisão Proporcional do Tempo:** O tempo total é distribuído automaticamente entre categorias como Aquecimento, Fortalecimento, Alongamento, Exercícios com Equipamentos e Aeróbico.
- **Seleção Aleatória de Exercícios:** Os exercícios são selecionados aleatoriamente para garantir variedade em cada treino.
- **Interface de Administração:** Área protegida por autenticação para adicionar, editar e remover exercícios do banco de dados.
- **Responsividade e Acessibilidade:** Layout adaptável para diferentes dispositivos e com foco na acessibilidade para todos os usuários.
- **Tema Escuro Moderno:** Design contemporâneo com tema escuro para melhor visualização.
- **Animação de Carregamento Personalizada:** Loader animado exibido durante a geração do treino para melhor experiência do usuário.
- **Máscaras de Entrada:** Aplicação de máscaras nos campos de entrada para facilitar a inserção de dados pelo usuário.

## Como Usar

### Gerar Treino

1. **Acesse o Site:** Visite a página hospedada no GitHub Pages: [Gerador de Treinos](https://luca007.github.io/gerador-de-exercicios/)
2. **Preencha o Formulário:**
      - Insira o **tempo disponível** para o treino (em minutos).
      - Selecione o **nível do treino** desejado.
      - Escolha a **categoria etária** correspondente.
3. **Gere o Treino:**
      - Clique no botão **"Gerar Treino"**.
      - Aguarde enquanto o sistema processa e gera seu treino personalizado.
4. **Visualize o Treino:**
      - O treino será exibido com a lista de exercícios divididos nas categorias correspondentes.
      - Cada exercício inclui detalhes como:
           - Nome
           - Duração
           - Explicação (se disponível)
           - Repetições (se disponível)
           - Séries (se disponível)
           - Equipamentos necessários (se aplicável)

### Área de Administração

1. **Acessar a Área de Administração:**
      - Clique no botão **"Administrador"** na página principal.
      - Se você já estiver autenticado, será direcionado para a interface de administração.
2. **Autenticação:**
      - Caso não esteja autenticado, será solicitado que você faça login com suas credenciais de administrador.
3. **Gerenciar Exercícios:**
      - Adicione novos exercícios preenchendo o formulário com os detalhes necessários.
      - Edite ou remova exercícios existentes conforme necessário.

## Tecnologias Utilizadas

- **HTML5 e CSS3:** Estruturação e estilização das páginas web.
- **JavaScript ES6+:** Lógica do aplicativo, manipulação do DOM e comunicação com o Firebase.
- **Firebase Firestore:** Banco de dados NoSQL para armazenar e recuperar os exercícios.
- **Firebase Authentication:** Sistema de autenticação para proteger a área de administração.
- **Tailwind:** Estilização da página assim como alguns ajustes de responsividade.

## Estrutura do Projeto

- **Arquivos HTML:**
- `index.html`: Página principal com o formulário para gerar treinos.
- **Arquivos CSS:**
- `styles.css`: Estilos personalizados para o tema e layout geral.
- `loader.css`: Estilos para a animação de carregamento.
- `loginForm.css`: Estilos para o formulário de login da área de administração.
- `buttonGenerate.css`, `buttonEdit.css`, `buttonDelete.css`: Estilos para botões personalizados.
- `checkbox.css`, `select.css`, `inputTime.css`: Estilos para elementos de formulário personalizados.
- `navBar.css`: Estilo para a barra de navegação da sessão de administrador.
- **Arquivos JavaScript:**
- `admin.js`: Lógica da interface de administração e formulário de login.
- `auth.js`: Gerenciamento do estado de autenticação do usuário.
- `createLogin.js`: Funções para criação e tratamento do login de administrador.
- `exercicio.js`: Gerencia a interface e operações relacionadas aos exercícios.
- `firebase.js`: Configuração e inicialização do Firebase.
- `firestore.js`: Funções para interação com o Firestore, como obter, adicionar, atualizar e deletar exercícios.
- `formGenerator.js`: Funções para criação dinâmica de formulários.
- `formUtils.js`: Funções auxiliares para validação e construção de mensagens de alerta.
- `logout.js`: Função para tratar do logout do administrador.
- `main.js`: Arquivo principal que importa os demais módulos JavaScript.
- `navBar.js`: Funções que criam e gerenciam a barra de navegação.
- `treino.js`: Contém a lógica para gerar e exibir os treinos personalizados.
- `utils.js`: Funções utilitárias usadas em todo o projeto, como máscaras de entrada e exibição de alertas.

## Como Configurar Localmente

1. **Clone o Repositório:**

          ```bash
          git clone https://github.com/luca007/gerador-de-exercicios.git
          ```

2. **Instale as Dependências:**

          - Como este é um site estático, não há dependências de backend.
          - Certifique-se de incluir o SDK do Firebase em seu projeto.
          - Se estiver usando módulos ES6 e importações, configure um servidor local ou use ferramentas como o Vite ou Webpack para empacotar o projeto.

3. **Configure o Firebase:**

          - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
          - Ative os serviços do **Firestore** e **Authentication**.
          - Substitua as configurações em `firebase.js` pelas suas configurações do Firebase.

4. **Inicie o Projeto:**

          - Se estiver usando um servidor local, inicie-o e acesse `index.html` através do servidor.
          - Caso contrário, abra o `index.html` diretamente em um navegador web (algumas funcionalidades podem não funcionar corretamente devido às importações de módulos).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir **issues** e **pull requests**.

1. **Fork o Repositório**
2. **Crie uma Branch para Sua Funcionalidade**
          ```bash
          git checkout -b minha-funcionalidade
          ```
3. **Faça o Commit das Suas Alterações**
          ```bash
          git commit -m "Adiciona nova funcionalidade"
          ```
4. **Envie para o Repositório Remoto**
          ```bash
          git push origin minha-funcionalidade
          ```
5. **Abra um Pull Request**

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
