// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-login');

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const correo = document.getElementById('correo-login').value;
        const contrasena = document.getElementById('contrasena-login').value;

        // Validamos las credenciales
        const exito = VertexDB.iniciarSesion(correo, contrasena);

        if (exito) {
            alert('Sesión iniciada correctamente.');
            window.location.href = 'index.html'; // Llevamos al usuario a la página principal
        } else {
            alert('Correo o contraseña incorrectos. Por favor, intenta de nuevo.');
        }
    });
});