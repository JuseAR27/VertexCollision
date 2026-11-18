const SELECTORES_REGISTRO = {
  formulario: '#formRegistro, form',
  nombre: '#nombre, #nombre_completo, input[name="nombre"]',
  correo: '#correo, #email, input[type="email"]',
  telefono: '#telefono, input[type="tel"]',
  contrasena: '#contrasena, #password, input[type="password"]',
  confirmar: '#confirmarContrasena, #confirmPassword'
};

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector(SELECTORES_REGISTRO.formulario);
  if (!formulario) return;

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Obtenemos las referencias a los campos del formulario
    const inputNombre = formulario.querySelector(SELECTORES_REGISTRO.nombre);
    const inputCorreo = formulario.querySelector(SELECTORES_REGISTRO.correo);
    const inputTelefono = formulario.querySelector(SELECTORES_REGISTRO.telefono);
    const inputContrasena = formulario.querySelector(SELECTORES_REGISTRO.contrasena);
    const inputConfirmar = formulario.querySelector(SELECTORES_REGISTRO.confirmar);

    const nombre_completo = inputNombre ? inputNombre.value.trim() : '';
    const correo = inputCorreo ? inputCorreo.value.trim() : '';
    const telefono = inputTelefono ? inputTelefono.value.trim() : '';
    const contrasena = inputContrasena ? inputContrasena.value : '';

    // Validación básica de información en el cliente
    if (!nombre_completo || !correo || !contrasena) {
      alert('Por favor completa tu nombre, correo electrónico y contraseña.');
      return;
    }

    if (contrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (inputConfirmar && inputConfirmar.value !== contrasena) {
      alert('Las contraseñas ingresadas no coinciden.');
      return;
    }

    // Envío de datos al backend
    try {
      await VertexDB.registrarUsuario({
        nombre_completo,
        correo,
        contrasena,
        telefono
      });

      alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      window.location.href = 'login.html';
    } catch (error) {
      alert(error.message);
    }
  });
});