const MOSTRAR_SOLO_PRIMER_NOMBRE = false;

document.addEventListener('DOMContentLoaded', () => {
  if (window.VertexDB && typeof VertexDB.init === 'function') {
    VertexDB.init();
  }

  actualizarBarraNavegacion();
  actualizarContadorCarrito();
});

function actualizarBarraNavegacion() {
  if (!window.VertexDB) return;

  const usuario = VertexDB.obtenerSesionActual();
  const nav = document.querySelector('header nav, .navbar nav, nav');
  if (!nav) return;

  const enlaceUsuario =
    document.getElementById('nav-login') ||
    nav.querySelector('a[href*="login.html"]') ||
    nav.querySelector('a[href*="registro.html"]') ||
    nav.querySelector('a[href*="perfil.html"]');

  document.getElementById('nav-btn-logout')?.remove();
  document.getElementById('nav-link-admin')?.remove();

  // El usuario tiene una sesión iniciada
  if (usuario) {
    const nombreCompleto = usuario.nombre_completo || usuario.nombre || 'Mi Perfil';
    const textoMostrar = MOSTRAR_SOLO_PRIMER_NOMBRE
      ? nombreCompleto.split(' ')[0]
      : nombreCompleto;

    if (enlaceUsuario) {
      enlaceUsuario.textContent = `${textoMostrar}`;
      enlaceUsuario.href = 'perfil.html';
      enlaceUsuario.title = 'Ir a mi perfil';
      enlaceUsuario.style.color = '#ff5722';
      enlaceUsuario.style.fontWeight = '700';
    }

    // Si es administrador, enlace al panel de administración
    if (usuario.rol === 'admin') {
      const linkAdmin = document.createElement('a');
      linkAdmin.id = 'nav-link-admin';
      linkAdmin.href = 'admin.html';
      linkAdmin.textContent = 'Panel Admin';
      linkAdmin.style.cssText = 'color: #f0f6fc; text-decoration: none; font-weight: 600; margin-left: 12px;';
      nav.appendChild(linkAdmin);
    }

    // Botón para Cerrar Sesión
    const btnCerrarSesion = document.createElement('a');
    btnCerrarSesion.id = 'nav-btn-logout';
    btnCerrarSesion.href = '#';
    btnCerrarSesion.textContent = 'Cerrar Sesión';
    btnCerrarSesion.style.cssText =
      'margin-left: 14px; padding: 6px 14px; border-radius: 6px; border: 1px solid #ff5722; background: transparent; color: #f0f6fc; text-decoration: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: 0.2s;';

    btnCerrarSesion.addEventListener('mouseenter', () => {
      btnCerrarSesion.style.background = '#ff5722';
      btnCerrarSesion.style.color = '#ffffff';
    });
    btnCerrarSesion.addEventListener('mouseleave', () => {
      btnCerrarSesion.style.background = 'transparent';
      btnCerrarSesion.style.color = '#f0f6fc';
    });

    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      VertexDB.cerrarSesion();
      window.location.href = 'index.html';
    });

    nav.appendChild(btnCerrarSesion);
  } else {
    // No hay sesión iniciada
    if (enlaceUsuario) {
      const rutaActual = window.location.pathname.toLowerCase();
      const esPaginaLogin = rutaActual.includes('login.html');

      if (esPaginaLogin) {
        enlaceUsuario.textContent = 'Registrarse';
        enlaceUsuario.href = 'registro.html';
      } else {
        enlaceUsuario.textContent = 'Iniciar Sesión';
        enlaceUsuario.href = 'login.html';
      }

      enlaceUsuario.style.color = '';
      enlaceUsuario.style.fontWeight = '';
    }
  }
}

/**
 * Sincroniza el número de productos en el enlace del Carrito
 */
function actualizarContadorCarrito() {
  if (!window.VertexDB) return;

  const enlaceCarrito = document.querySelector('nav a[href*="carrito.html"], #nav-cart');
  if (!enlaceCarrito) return;

  const carrito = VertexDB.obtenerCarrito();
  const totalUnidades = carrito.reduce((acum, item) => acum + (Number(item.cantidad) || 1), 0);

  enlaceCarrito.textContent = totalUnidades > 0 ? `Carrito (${totalUnidades})` : 'Carrito';
}

window.actualizarBarraNavegacion = actualizarBarraNavegacion;
window.actualizarContadorCarrito = actualizarContadorCarrito;