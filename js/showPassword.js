document.addEventListener("DOMContentLoaded", () => {
    const togglePassword = document.querySelector(".toggle-password .container input");
    const passwordInput = document.querySelector("#password");

    if (togglePassword) {
        togglePassword.addEventListener("change", () => {
            if (togglePassword.checked) {
                passwordInput.setAttribute("type", "text");
            } else {
                passwordInput.setAttribute("type", "password");
            }
        });
    }
});