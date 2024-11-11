// Monitorar o estado de autenticação
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário autenticado
        createAdminInterface();
    } else {
        // Usuário não autenticado
        // A interface de login será gerada ao clicar no botão
    }
});
  