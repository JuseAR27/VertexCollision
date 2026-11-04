document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = VertexDB.obtenerUsuarioActual();

    // Si no hay sesión, redirigimos al login por seguridad
    if (!usuarioActual) {
        alert('Debes iniciar sesión para ver tu perfil.');
        window.location.href = 'login.html';
        return;
    }

    // 1. Cargar los datos actuales en el formulario
    document.getElementById('perfil-nombre').value = usuarioActual.nombre_completo;
    document.getElementById('perfil-correo').value = usuarioActual.correo;
    document.getElementById('perfil-telefono').value = usuarioActual.telefono;

    // 2. Manejar la actualización del formulario
    const formulario = document.getElementById('form-perfil');
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nuevosDatos = {
            nombre_completo: document.getElementById('perfil-nombre').value,
            telefono: document.getElementById('perfil-telefono').value,
            // Solo mandamos contraseña si el usuario escribió algo
            contrasena: document.getElementById('perfil-contrasena').value || null 
        };

        const exito = VertexDB.actualizarPerfil(usuarioActual.id_usuario, nuevosDatos);

        if (exito) {
            alert('¡Perfil actualizado con éxito!');
            window.location.reload(); // Recargamos para actualizar el saludo en el header
        } else {
            alert('Ocurrió un error al actualizar el perfil.');
        }
    });
});