const SELECTORES_LOGIN = {
  formulario: '#formLogin, form',
  correo: '#correo, #email, input[type="email"]',
  contrasena: '#contrasena, #password, input[type="password"]'
};

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector(SELECTORES_LOGIN.formulario);
  if (!formulario) return;

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const inputCorreo = formulario.querySelector(SELECTORES_LOGIN.correo);
    const inputContrasena = formulario.querySelector(SELECTORES_LOGIN.contrasena);

    const correo = inputCorreo ? inputCorreo.value.trim() : '';
    const contrasena = inputContrasena ? inputContrasena.value : '';

    if (!correo || !contrasena) {
      alert('Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      const usuario = await VertexDB.iniciarSesion(correo, contrasena);

      // Si el usuario está en la tabla ADMINISTRADOR lo enviamos al panel admin
      if (usuario.rol === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } catch (error) {
      alert(error.message);
    }
  });
});