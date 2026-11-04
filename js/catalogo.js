document.addEventListener('DOMContentLoaded', () => {
    const todosLosProductos = VertexDB.obtenerProductos();
    
    // Inicializar catálogo base
    renderizarCatalogo(todosLosProductos);

    // Variables de Estado para el filtro relacional
    let marcas = VertexDB.obtenerTabla('MARCAS');
    let modelos = VertexDB.obtenerTabla('MODELOS');
    let vehiculos = VertexDB.obtenerTabla('VEHICULOS');

    // Referencias al DOM
    const selMarca = document.getElementById('sel-marca');
    const selModelo = document.getElementById('sel-modelo');
    const selAnio = document.getElementById('sel-anio');
    const selMotor = document.getElementById('sel-motor');
    const btnBuscarPiezas = document.getElementById('btn-buscar-piezas');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    const inputBusquedaTexto = document.getElementById('input-busqueda');

    // 1. Cargar Marcas Iniciales
    cargarOpciones(selMarca, marcas, 'id_marca_auto', 'nombre_marca');

    // 2. Evento: Al seleccionar MARCA
    selMarca.addEventListener('change', (e) => {
        const idMarca = parseInt(e.target.value);
        resetearSelects([selModelo, selAnio, selMotor]);
        btnBuscarPiezas.disabled = true;

        if (idMarca) {
            // Filtrar modelos que pertenezcan a la marca seleccionada (FK id_marca_auto)
            const modelosFiltrados = modelos.filter(m => m.id_marca_auto === idMarca);
            cargarOpciones(selModelo, modelosFiltrados, 'id_modelo_auto', 'nombre_modelo');
            selModelo.disabled = false;
        }
    });

    // 3. Evento: Al seleccionar MODELO
    selModelo.addEventListener('change', (e) => {
        const idModelo = parseInt(e.target.value);
        resetearSelects([selAnio, selMotor]);
        btnBuscarPiezas.disabled = true;

        if (idModelo) {
            // Extraemos los años únicos disponibles para ese modelo específico en la tabla VEHICULOS
            const vehiculosModelo = vehiculos.filter(v => v.id_modelo_auto === idModelo);
            const aniosUnicos = [...new Set(vehiculosModelo.map(v => v.anio_fabricacion))];
            
            // Creamos un array de objetos temporal para reutilizar cargarOpciones
            const opcionesAnio = aniosUnicos.map(a => ({ id: a, nombre: a }));
            cargarOpciones(selAnio, opcionesAnio, 'id', 'nombre');
            selAnio.disabled = false;
        }
    });

    // 4. Evento: Al seleccionar AÑO
    selAnio.addEventListener('change', (e) => {
        const anio = parseInt(e.target.value);
        const idModelo = parseInt(selModelo.value);
        resetearSelects([selMotor]);
        btnBuscarPiezas.disabled = true;

        if (anio) {
            // Extraemos el motor específico para ese modelo y año
            const vehiculosFiltrados = vehiculos.filter(v => v.id_modelo_auto === idModelo && v.anio_fabricacion === anio);
            cargarOpciones(selMotor, vehiculosFiltrados, 'id_vehiculo', 'motor');
            selMotor.disabled = false;
        }
    });

    // 5. Evento: Al seleccionar MOTOR (Último paso)
    selMotor.addEventListener('change', (e) => {
        if (e.target.value) {
            btnBuscarPiezas.disabled = false; // Habilitamos el botón de búsqueda
        } else {
            btnBuscarPiezas.disabled = true;
        }
    });

    // 6. Acción: Buscar Piezas (JOIN Simulado)
    btnBuscarPiezas.addEventListener('click', () => {
        const idVehiculo = selMotor.value;
        const productosCompatibles = VertexDB.obtenerProductosCompatibles(idVehiculo);
        
        // Limpiamos la búsqueda por texto si está activa
        inputBusquedaTexto.value = '';
        
        renderizarCatalogo(productosCompatibles);
        btnLimpiar.style.display = 'block'; // Mostramos el botón de limpiar
    });

    // 7. Acción: Limpiar Filtros
    btnLimpiar.addEventListener('click', () => {
        selMarca.value = "";
        resetearSelects([selModelo, selAnio, selMotor]);
        btnBuscarPiezas.disabled = true;
        btnLimpiar.style.display = 'none';
        
        renderizarCatalogo(todosLosProductos); // Restaurar catálogo completo
    });

    // Búsqueda por texto (mantenemos la funcionalidad anterior)
    inputBusquedaTexto.addEventListener('input', () => {
        const textoBusqueda = inputBusquedaTexto.value.toLowerCase();
        const productosFiltrados = todosLosProductos.filter(producto => 
            producto.nombre.toLowerCase().includes(textoBusqueda) || 
            producto.numeroParte.toLowerCase().includes(textoBusqueda)
        );
        renderizarCatalogo(productosFiltrados);
    });
});

// Funciones Auxiliares
function cargarOpciones(selectElement, arrayDatos, propValor, propTexto) {
    selectElement.innerHTML = '<option value="">Selecciona</option>'; // Limpiar
    arrayDatos.forEach(item => {
        const option = document.createElement('option');
        option.value = item[propValor];
        option.textContent = item[propTexto];
        selectElement.appendChild(option);
    });
}

function resetearSelects(arraySelects) {
    arraySelects.forEach(sel => {
        sel.innerHTML = '<option value="">Selecciona</option>';
        sel.disabled = true;
    });
}

function renderizarCatalogo(listaProductos) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    if (listaProductos.length === 0) {
        contenedor.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--color-texto-secundario);">No se encontraron piezas compatibles con esta selección.</p>';
        return;
    }

    listaProductos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-producto');
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

    // Reasignar eventos al carrito
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', (evento) => {
            VertexDB.agregarAlCarrito(evento.target.getAttribute('data-id'));
            if(typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
            alert('¡Producto agregado al carrito!');
        });
    });
}

function asignarEventosBotones() {
    const botones = document.querySelectorAll('.btn-agregar');
    botones.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            // Evitamos el comportamiento por defecto por si el botón está dentro de un formulario
            evento.preventDefault(); 
            
            const idProducto = evento.target.getAttribute('data-id');
            VertexDB.agregarAlCarrito(idProducto);
            
            // ¡NUEVO! Llamamos a la función global que está en js/app.js
            if(typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
            
            alert('¡Producto agregado al carrito!');
        });
    });
}