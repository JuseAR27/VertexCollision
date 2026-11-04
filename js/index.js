// js/index.js
document.addEventListener('DOMContentLoaded', () => {
    // Llamamos a la función principal al cargar la página
    renderizarDestacados();
});

function renderizarDestacados() {
    const contenedor = document.getElementById('contenedor-destacados');
    const todosLosProductos = VertexDB.obtenerProductos();
    const productosDestacados = todosLosProductos.slice(0, 5);

    // Limpiamos el contenedor por si acaso
    contenedor.innerHTML = '';

    // Si no hay productos en la base de datos
    if (productosDestacados.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--color-texto-secundario);">No hay productos destacados por el momento.</p>';
        return;
    }

    // Recorremos solo los 5 productos y creamos sus tarjetas
    productosDestacados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto'); // Reutilizamos la clase del catálogo

        tarjeta.innerHTML = `
            <a href="producto.html?id=${producto.id}" style="text-decoration: none;">
                <img src="img/pieza2.png" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p style="color: var(--color-texto-secundario); font-size: 0.85rem; margin-bottom: 5px;">SKU: ${producto.numeroParte}</p>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
            </a>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
        `;
        
        contenedor.appendChild(tarjeta);
    });

    // Asignamos la funcionalidad del carrito a los botones recién creados
    asignarEventosCarritoIndex();
}

function asignarEventosCarritoIndex() {
    const botones = document.querySelectorAll('.btn-agregar');
    botones.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            evento.preventDefault(); 
            
            const idProducto = evento.target.getAttribute('data-id');
            VertexDB.agregarAlCarrito(idProducto);
            
            if(typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
            
            alert('¡Producto agregado al carrito exitosamente!');
        });
    });
}