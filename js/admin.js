document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificación Estricta de Sesión y Rol
    const usuarioActual = VertexDB.obtenerUsuarioActual();
    
    // Si no hay sesión o el rol NO es admin, lo expulsamos
    if (!usuarioActual || usuarioActual.rol !== 'admin') {
        alert('Acceso denegado. Solo los administradores pueden ver esta página.');
        window.location.href = 'index.html';
        return; // Detenemos la ejecución del script
    }

    // 2. Navegación por Pestañas (Tabs)
    const botonesTab = document.querySelectorAll('.tab-btn');
    const paneles = document.querySelectorAll('.admin-panel');

    botonesTab.forEach(boton => {
        boton.addEventListener('click', () => {
            botonesTab.forEach(b => b.classList.remove('activo'));
            paneles.forEach(p => p.classList.remove('activo'));
            boton.classList.add('activo');
            const targetId = boton.getAttribute('data-target');
            document.getElementById(targetId).classList.add('activo');
        });
    });

    // 3. Inicializar Tablas
    renderizarTablaProductos();
    renderizarTablaPedidos();
    renderizarTablaUsuarios();

    // 4. Lógica del Formulario Modal (Productos)
    // (Mantenemos tu lógica anterior para productos)
    const modalProd = document.getElementById('modal-producto');
    const formProducto = document.getElementById('form-admin-producto');
    document.getElementById('btn-nuevo-producto').addEventListener('click', () => {
        document.getElementById('modal-titulo').textContent = 'Agregar Nuevo Producto';
        formProducto.reset();
        document.getElementById('admin-prod-id').value = ''; 
        modalProd.style.display = 'flex';
    });
    document.getElementById('btn-cancelar-modal').addEventListener('click', () => {
        modalProd.style.display = 'none';
    });
    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const productoData = {
            id: parseInt(document.getElementById('admin-prod-id').value) || null,
            nombre: document.getElementById('admin-prod-nombre').value,
            precio: parseFloat(document.getElementById('admin-prod-precio').value),
            stock: parseInt(document.getElementById('admin-prod-stock').value),
            categoria: document.getElementById('admin-prod-categoria').value,
            marca: document.getElementById('admin-prod-marca').value,
            numeroParte: document.getElementById('admin-prod-numero').value,
            descripcion: document.getElementById('admin-prod-desc').value
        };
        if (productoData.id) { VertexDB.modificarProducto(productoData); alert('Producto actualizado.'); } 
        else { VertexDB.agregarProducto(productoData); alert('Producto agregado.'); }
        modalProd.style.display = 'none';
        renderizarTablaProductos();
    });

    // 5. Lógica del Formulario Modal (Pedidos)
    const modalPed = document.getElementById('modal-pedido');
    const formPedido = document.getElementById('form-admin-pedido');
    
    document.getElementById('btn-cancelar-modal-ped').addEventListener('click', () => {
        modalPed.style.display = 'none';
    });

    formPedido.addEventListener('submit', (e) => {
        e.preventDefault();
        const idPedido = document.getElementById('admin-ped-id').value;
        const nuevoEstado = document.getElementById('admin-ped-estado').value;
        
        VertexDB.modificarEstadoPedido(idPedido, nuevoEstado);
        alert('El estado del pedido ha sido actualizado.');
        
        modalPed.style.display = 'none';
        renderizarTablaPedidos(); // Refrescar la tabla
    });

    // 6. Botón Cerrar Sesión Admin
    document.getElementById('btn-cerrar-sesion-admin').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(VertexDB.KEYS.SESION);
        window.location.href = 'login.html';
    });
});

// --- FUNCIONES DE RENDERIZADO DE TABLAS ---

function renderizarTablaProductos() {
    const tbody = document.getElementById('tabla-body-productos');
    const productos = VertexDB.obtenerProductos();
    tbody.innerHTML = '';
    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td style="color: ${producto.stock < 5 ? '#f44336' : 'inherit'};"><strong>${producto.stock}</strong></td>
            <td><button class="btn-editar btn-editar-prod" data-id="${producto.id}">Editar</button></td>
        `;
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.btn-editar-prod').forEach(boton => {
        boton.addEventListener('click', (e) => abrirModalEdicionProd(e.target.getAttribute('data-id')));
    });
}

function abrirModalEdicionProd(id) {
    const producto = VertexDB.obtenerProductos().find(p => p.id === parseInt(id));
    if (!producto) return;
    document.getElementById('modal-titulo').textContent = 'Modificar Producto';
    document.getElementById('admin-prod-id').value = producto.id;
    document.getElementById('admin-prod-nombre').value = producto.nombre;
    document.getElementById('admin-prod-precio').value = producto.precio;
    document.getElementById('admin-prod-stock').value = producto.stock;
    document.getElementById('admin-prod-categoria').value = producto.categoria;
    document.getElementById('admin-prod-marca').value = producto.marca || '';
    document.getElementById('admin-prod-numero').value = producto.numeroParte || '';
    document.getElementById('admin-prod-desc').value = producto.descripcion || '';
    document.getElementById('modal-producto').style.display = 'flex';
}

function renderizarTablaPedidos() {
    const tbody = document.getElementById('tabla-body-pedidos');
    const pedidos = VertexDB.obtenerTodosLosPedidos();
    tbody.innerHTML = '';
    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay pedidos registrados.</td></tr>';
        return;
    }
    pedidos.reverse().forEach(pedido => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${pedido.id_pedido}</td>
            <td>${pedido.fecha}</td>
            <td>$${pedido.total.toFixed(2)}</td>
            <td><span class="estado-badge">${pedido.estado}</span></td>
            <td><button class="btn-editar btn-editar-ped" data-id="${pedido.id_pedido}" data-estado="${pedido.estado}">Modificar</button></td>
        `;
        tbody.appendChild(tr);
    });
    
    // Evento para editar pedido
    document.querySelectorAll('.btn-editar-ped').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const estadoActual = e.target.getAttribute('data-estado');
            document.getElementById('admin-ped-id').value = id;
            document.getElementById('admin-ped-estado').value = estadoActual;
            document.getElementById('modal-pedido').style.display = 'flex';
        });
    });
}

function renderizarTablaUsuarios() {
    const tbody = document.getElementById('tabla-body-usuarios');
    const usuarios = VertexDB.obtenerTodosLosUsuarios();
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        // Le damos un color distinto a los administradores para que resalten
        const colorRol = usuario.rol === 'admin' ? '#ff5722' : '#9ca3af';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id_usuario}</td>
            <td>${usuario.nombre_completo}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.telefono}</td>
            <td style="color: ${colorRol}; font-weight: bold; text-transform: capitalize;">${usuario.rol}</td>
        `;
        tbody.appendChild(tr);
    });
}