import { auth } from './firebase.js';
import { createNavBar, attachNavEvents } from './navBar.js';
import { createAdminInterface } from './admin.js';
import { handleLogout } from './logout.js';
import { exibirAlerta, removeExistingSections, loader } from './utils.js';
import { criarGerenciamentoExercicios } from './exercicio.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';


// Elementos do DOM relacionados à administração
const adminButton = document.getElementById('admin-button'); // Botão de administrador

// Evento de clique no botão de administrador
adminButton.addEventListener('click', () => {
  createLoginForm();
});

// Função para criar o formulário de login
export function createLoginForm() {
    // Remover instâncias anteriores
    removeExistingSections();

    // Criar o formulário de login
    const form = createLoginSection();

    // Criar e adicionar grupos de campos
    const emailGroup = createEmailGroup();
    const passwordGroup = createPasswordGroup();
    const submitButton = createSubmitButton();

    form.appendChild(emailGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitButton);

    // Adicionar eventos ao formulário
    setupFormEvents(form);
}

// Função para criar a seção de login
function createLoginSection() {
    // Criar a seção de login
    const loginSection = document.createElement('div');
    loginSection.id = 'login-section';
    loginSection.className = 'login-form-container';

    // Criar o formulário
    const form = document.createElement('form');
    form.className = 'form';
    form.id = 'login-form';

    // Adicionar o formulário à seção de login
    loginSection.appendChild(form);

    // Adicionar a seção de login ao body
    document.body.appendChild(loginSection);

    return form;
}

// Função para criar o grupo de email
function createEmailGroup() {
    // --- Grupo do Email ---
    const emailGroup = document.createElement('div');
    emailGroup.className = 'login-form-group';

    const emailLabel = document.createElement('label');
    emailLabel.setAttribute('for', 'email');
    emailLabel.innerText = 'Email';

    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.id = 'email';
    emailInput.type = 'text';
    emailInput.required = false;
    emailInput.setAttribute('autocomplete', 'email');

    // Adicionar label e input ao grupo de email
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);

    return emailGroup;
}

// Função para criar o grupo de senha
function createPasswordGroup() {
    // --- Grupo da Senha ---
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'login-form-group';

    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.innerText = 'Senha';

    const passwordWrapper = document.createElement('div');
    passwordWrapper.className = 'password-wrapper';

    const passwordInput = document.createElement('input');
    passwordInput.name = 'password';
    passwordInput.id = 'password';
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Digite sua senha';
    passwordInput.required = false;
    passwordInput.setAttribute('autocomplete', 'current-password');

    const togglePasswordSpan = createTogglePassword();

    // Montar o password wrapper
    passwordWrapper.appendChild(passwordInput);
    passwordWrapper.appendChild(togglePasswordSpan);

    // Adicionar label e wrapper ao grupo da senha
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordWrapper);

    return passwordGroup;
}

// Função para criar o toggle de mostrar/ocultar senha
function createTogglePassword() {
    const togglePasswordSpan = document.createElement('span');
    togglePasswordSpan.className = 'toggle-password';

    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'password-container';

    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.id = 'togglePassword';

    // Ícone de olho aberto
    const eyeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    eyeIcon.classList.add('eye');
    eyeIcon.setAttribute('height', '1em');
    eyeIcon.setAttribute('viewBox', '0 0 576 512');

    const eyePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    eyePath.setAttribute(
        'd',
        'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8 -11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
    );
    eyeIcon.appendChild(eyePath);

    // Ícone de olho fechado
    const eyeSlashIcon = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );
    eyeSlashIcon.classList.add('eye-slash');
    eyeSlashIcon.setAttribute('height', '1em');
    eyeSlashIcon.setAttribute('viewBox', '0 0 640 512');

    const eyeSlashPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    );
    eyeSlashPath.setAttribute(
        'd',
        'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
    );
    eyeSlashIcon.appendChild(eyeSlashPath);

    // Montar o label do toggle
    toggleLabel.appendChild(toggleCheckbox);
    toggleLabel.appendChild(eyeIcon);
    toggleLabel.appendChild(eyeSlashIcon);

    // Adicionar o label ao span
    togglePasswordSpan.appendChild(toggleLabel);

    return togglePasswordSpan;
}

// Função para criar o botão de submissão
function createSubmitButton() {
    // --- Botão de Submissão ---
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'login-form-submit-btn';
    submitButton.innerText = 'Entrar';

    return submitButton;
}

// Função para configurar os eventos do formulário
function setupFormEvents(form) {
    // Evento de submissão do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.email.value;
        const password = form.password.value;

        // Mostrar o loader
        loader.style.display = 'flex';
        document.body.classList.add('no-scroll');

        if (!email) {
            loader.style.display = 'none';
            document.body.classList.remove('no-scroll');
            exibirAlerta('aviso', 'Por favor, preencha o campo Email.');
            return;
        }
        if (!password) {
            loader.style.display = 'none';
            document.body.classList.remove('no-scroll');
            exibirAlerta('aviso', 'Por favor, preencha o campo Senha.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                // Ocultar o loader
                loader.style.display = 'none';
                document.body.classList.remove('no-scroll');
                // Limpar o formulário
                form.reset();
                // Mostrar a interface de administrador
                createAdminInterface();
                // Mostra a barra de navegação
                createNavBar();

                // Anexar eventos da navbar
                attachNavEvents({
                    createAdminInterface,
                    criarGerenciamentoExercicios,
                    handleLogout
                });

                exibirAlerta('sucesso', 'Bem-vindo!');
            })
            .catch((error) => {
                // Ocultar o loader
                loader.style.display = 'none';
                document.body.classList.remove('no-scroll');
                if (
                    error.code === 'auth/invalid-login-credentials' ||
                    error.code === 'auth/invalid-email'
                ) {
                    exibirAlerta('erro', 'Email ou senha está incorreta.');
                } else {
                    exibirAlerta('erro', 'Erro ao fazer login: ' + error.message);
                }
            });
    });

    // Evento para mostrar/ocultar a senha
    const passwordInput = form.querySelector('#password');
    const togglePassword = form.querySelector('#togglePassword');
    setupPasswordToggleEvent(passwordInput, togglePassword);
}

// Função para configurar o evento de mostrar/ocultar a senha
function setupPasswordToggleEvent(passwordInput, togglePassword) {
    togglePassword.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
}