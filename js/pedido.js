document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = VertexDB.obtenerUsuarioActual();

    // Protección de ruta: si no hay sesión, regresamos al login
    if (!usuarioActual) {
        alert('Debes iniciar sesión para ver tus pedidos.');
        window.location.href = 'login.html';
        return;
    }

    renderizarPedidos(usuarioActual.id_usuario);
});

function renderizarPedidos(id_usuario) {
    const contenedor = document.getElementById('lista-pedidos');
    const pedidos = VertexDB.obtenerPedidosUsuario(id_usuario);

    contenedor.innerHTML = ''; // Limpiamos el contenedor

    if (pedidos.length === 0) {
        contenedor.innerHTML = '<div class="tarjeta-pedido"><p>Aún no has realizado ninguna compra.</p><a href="catalogo.html">Ir al catálogo</a></div>';
        return;
    }

    pedidos.forEach(pedido => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-pedido');

        // Generamos el HTML de los artículos comprados (detalle del pedido)
        let listaArticulosHTML = '';
        pedido.articulos.forEach(articulo => {
            const subtotal = articulo.precio * articulo.cantidad;
            listaArticulosHTML += `
                <li>
                    <span>${articulo.cantidad}x ${articulo.nombre}</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </li>
            `;
        });

        // Construimos la estructura de la tarjeta del pedido
        tarjeta.innerHTML = `
            <div class="pedido-header">
                <div>
                    <h3>Pedido #${pedido.id_pedido}</h3>
                    <small>Fecha: ${pedido.fecha}</small>
                </div>
                <div>
                    <span class="estado-badge">${pedido.estado}</span>
                </div>
            </div>
            <div class="pedido-detalles">
                <ul>
                    ${listaArticulosHTML}
                </ul>
                <div class="pedido-total">
                    Total Pagado: $${pedido.total.toFixed(2)} MXN
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}