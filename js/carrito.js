document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrito();
});

function renderizarCarrito() {
    const contenedor = document.getElementById('contenedor-carrito');
    const spanTotal = document.getElementById('monto-total');
    const carrito = VertexDB.obtenerCarrito();

    contenedor.innerHTML = ''; // Limpiamos la vista

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>Tu carrito está vacío. ¡Visita el catálogo!</p>';
        spanTotal.textContent = '0.00';
        return;
    }

    carrito.forEach(item => {
        const divItem = document.createElement('div');
        divItem.classList.add('item-carrito');

        // Calculamos el subtotal por artículo
        const subtotal = item.precio * item.cantidad;

        divItem.innerHTML = `
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>Precio Unitario: $${item.precio.toFixed(2)}</p>
                <p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>
            </div>
            <div class="item-controles">
                <label>Cant:</label>
                <!-- Input para modificar cantidad -->
                <input type="number" min="1" value="${item.cantidad}" class="input-cantidad" data-id="${item.id}">
                <!-- Botón para eliminar -->
                <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        contenedor.appendChild(divItem);
    });

    spanTotal.textContent = VertexDB.calcularTotal().toFixed(2);

    if(typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }

    asignarEventosCarrito();
}

function asignarEventosCarrito() {
    // 1. Evento para modificar cantidades
    const inputsCantidad = document.querySelectorAll('.input-cantidad');
    inputsCantidad.forEach(input => {
        input.addEventListener('change', (evento) => {
            const idProducto = evento.target.getAttribute('data-id');
            const nuevaCantidad = evento.target.value;
            
            // Actualizamos en la base de datos
            VertexDB.actualizarCantidad(idProducto, nuevaCantidad);
            // Volvemos a dibujar el carrito para reflejar los nuevos subtotales y total
            renderizarCarrito(); 
        });
    });

    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            const idProducto = evento.target.getAttribute('data-id');
            
            // Eliminamos de la base de datos
            VertexDB.eliminarDelCarrito(idProducto);
            // Volvemos a dibujar el carrito
            renderizarCarrito();
        });
    });

    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const usuario = VertexDB.obtenerUsuarioActual();
            
            if (!usuario) {
                alert('Debes iniciar sesión o registrarte para realizar la compra.');
                window.location.href = 'login.html';
                return; // Detenemos la ejecución
            }

            // Ejecutamos la transacción
            const resultado = VertexDB.procesarPedido(usuario.id_usuario);

            if (resultado.exito) {
                alert(`¡Compra exitosa! Tu número de pedido es #${resultado.id_pedido}`);
                window.location.href = 'pedidos.html'; // Redirigimos al historial
            } else {
                alert(`Error al procesar: ${resultado.mensaje}`);
            }
        });
    }
}
