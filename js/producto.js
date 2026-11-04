document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener el ID de la URL
    // URLSearchParams nos permite leer los valores después del "?" en la dirección web
    const parametrosURL = new URLSearchParams(window.location.search);
    const idProducto = parametrosURL.get('id');

    // Si no hay ID en la URL, regresamos al usuario al catálogo
    if (!idProducto) {
        window.location.href = 'catalogo.html';
        return;
    }

    // 2. Buscar el producto en la base de datos
    const productos = VertexDB.obtenerProductos();
    // Convertimos idProducto a número para compararlo correctamente
    const productoEncontrado = productos.find(p => p.id === parseInt(idProducto));

    // Si el producto no existe (ej. pusieron un ID inventado en la URL)
    if (!productoEncontrado) {
        document.querySelector('.contenedor-producto').innerHTML = '<h2>Producto no encontrado</h2><a href="catalogo.html">Volver al catálogo</a>';
        return;
    }

    // 3. Inyectar los datos en el HTML
    // Migas de pan
    document.getElementById('bread-categoria').textContent = productoEncontrado.categoria;
    document.getElementById('bread-nombre').textContent = productoEncontrado.nombre;

    // Información principal
    document.getElementById('titulo-producto').textContent = productoEncontrado.nombre;
    document.getElementById('precio-producto').textContent = `$${productoEncontrado.precio.toFixed(2)}`;
    document.getElementById('desc-producto').textContent = productoEncontrado.descripcion;
    document.getElementById('stock-producto').textContent = productoEncontrado.stock;
    document.getElementById('garantia-producto').textContent = productoEncontrado.garantia;

    // Especificaciones técnicas
    document.getElementById('spec-marca').textContent = productoEncontrado.marca;
    document.getElementById('spec-numero').textContent = productoEncontrado.numeroParte;

    // 4. Configurar el botón de "Agregar al carrito"
    const btnAgregar = document.getElementById('btn-agregar-carrito');
    btnAgregar.setAttribute('data-id', productoEncontrado.id); // Guardamos el ID en el botón de forma invisible

    btnAgregar.addEventListener('click', (evento) => {
        const idParaAgregar = evento.target.getAttribute('data-id');
        VertexDB.agregarAlCarrito(idParaAgregar);
        if(typeof actualizarContadorCarrito === 'function') {
            actualizarContadorCarrito();
        }
        alert(`${productoEncontrado.nombre} fue agregado a tu carrito exitosamente.`);
    });
});