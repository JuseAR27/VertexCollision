document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar la base de datos simulada
    VertexDB.inicializar();
    
    // 2. Verificar estado de la sesión
    verificarSesion();

    // 3. Actualizar el texto del carrito para mostrar la cantidad de artículos
    actualizarContadorCarrito();
});

function verificarSesion() {
    const sesionJSON = localStorage.getItem(VertexDB.KEYS.SESION);
    const linkLogin = document.getElementById('nav-login');
    
    if (sesionJSON) {
        // Convertimos el texto JSON a un objeto JavaScript
        const sesion = JSON.parse(sesionJSON);
        
        // A. Mostrar el nombre del usuario al lado del título de la tienda
        const tituloTienda = document.querySelector('header h1');
        // Verificamos que el título exista y que no hayamos agregado el saludo previamente
        if (tituloTienda && !document.getElementById('saludo-usuario')) {
            const spanSaludo = document.createElement('span');
            spanSaludo.id = 'saludo-usuario';
            // Aplicamos estilos desde JavaScript para integrarlo visualmente
            spanSaludo.style.fontSize = '1rem';
            spanSaludo.style.color = 'var(--color-texto-secundario)';
            spanSaludo.style.marginLeft = '15px';
            spanSaludo.style.paddingLeft = '15px';
            spanSaludo.style.borderLeft = '1px solid var(--color-borde)';
            spanSaludo.style.fontWeight = 'normal';
            spanSaludo.textContent = `Hola, ${sesion.nombre.split(' ')[0]}`;
            
            // Lo insertamos dentro del h1
            tituloTienda.appendChild(spanSaludo);
        }

        // B. Cambiar el botón de "Iniciar Sesión" a "Cerrar Sesión"
        if (linkLogin) {
            linkLogin.textContent = 'Cerrar Sesión';
            linkLogin.href = '#'; 
            
            // Usamos onclick en lugar de addEventListener para evitar duplicaciones si se recarga
            linkLogin.onclick = (evento) => {
                evento.preventDefault();
                localStorage.removeItem(VertexDB.KEYS.SESION);
                alert('Has cerrado sesión exitosamente.');
                // Redirigimos al inicio de manera segura
                window.location.href = 'index.html'; 
            };
        }
    }
}

function actualizarContadorCarrito() {
    // Buscamos el enlace del carrito en la barra de navegación
    const enlaceCarrito = document.querySelector('nav a[href="carrito.html"]');
    
    if (enlaceCarrito) {
        const carrito = VertexDB.obtenerCarrito();
        // Sumamos las cantidades de todos los artículos usando reduce
        const totalArticulos = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
        
        if (totalArticulos > 0) {
            enlaceCarrito.textContent = `Carrito (${totalArticulos})`;
            enlaceCarrito.style.color = 'var(--color-primario)'; // Destacamos el texto en naranja si hay algo
        } else {
            enlaceCarrito.textContent = 'Carrito';
            enlaceCarrito.style.color = 'var(--color-texto-principal)';
        }
    }
}