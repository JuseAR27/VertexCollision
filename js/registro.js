document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-registro');

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Evitamos que la página se recargue

        // Recopilamos los datos combinando atributos de USUARIO y CLIENTE
        const datosNuevoUsuario = {
            nombre_completo: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            telefono: document.getElementById('telefono').value,
            contrasena: document.getElementById('contrasena').value
        };

        // Llamamos a la base de datos simulada
        const exito = VertexDB.registrarUsuario(datosNuevoUsuario);

        if (exito) {
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            window.location.href = 'login.html'; // Redirigimos al login
        } else {
            alert('Error: Este correo electrónico ya está registrado.');
        }
    });
});