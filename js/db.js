const VertexDB = {
    KEYS: {
        PRODUCTOS: 'vertex_productos',
        USUARIOS: 'vertex_usuarios',
        SESION: 'vertex_sesion_activa',
        CARRITO: 'vertex_carrito',
        PEDIDOS: 'vertex_pedidos',
        MARCAS: 'tb_marca_auto',
        MODELOS: 'tb_modelo_auto',
        VEHICULOS: 'tb_vehiculo',
        COMPATIBILIDAD: 'tb_compatibilidad_vehiculo'
    },

    inicializar: function() {
        if (!localStorage.getItem(this.KEYS.PRODUCTOS)) {
            const productosIniciales = [
                { id: 1, nombre: 'Defensa Delantera - Sedán', precio: 1500, categoria: 'Colisión', stock: 5, marca: 'AutoPartes Pro', numeroParte: 'DP-SED-2023', descripcion: 'Defensa delantera de repuesto OEM.', garantia: '12 meses' },
                { id: 2, nombre: 'Par de Manijas de Puertas', precio: 450, categoria: 'Carrocería', stock: 12, marca: 'DoorTech', numeroParte: 'MNJ-PR-002', descripcion: 'Manijas exteriores con acabado texturizado.', garantia: '6 meses' },
                { id: 3, nombre: 'Cofre Metálico Universal', precio: 3200, categoria: 'Carrocería', stock: 3, marca: 'MetalPro', numeroParte: 'CF-UNI-001', descripcion: 'Cofre de acero galvanizado listo para pintar.', garantia: '24 meses' },
                { id: 4, nombre: 'Faro Principal Izquierdo', precio: 850, categoria: 'Iluminación', stock: 8, marca: 'LightVision', numeroParte: 'FR-IZQ-99', descripcion: 'Faro halógeno con mica de policarbonato.', garantia: '12 meses' },
                { id: 5, nombre: 'Faro Principal Derecho', precio: 850, categoria: 'Iluminación', stock: 7, marca: 'LightVision', numeroParte: 'FR-DER-99', descripcion: 'Faro halógeno con mica de policarbonato.', garantia: '12 meses' },
                { id: 6, nombre: 'Espejo Retrovisor Eléctrico', precio: 1100, categoria: 'Carrocería', stock: 4, marca: 'ViewMax', numeroParte: 'ESP-ELC-04', descripcion: 'Espejo lateral con ajuste eléctrico y desempañador.', garantia: '12 meses' },
                { id: 7, nombre: 'Parrilla Frontal Deportiva', precio: 950, categoria: 'Colisión', stock: 6, marca: 'SportGrill', numeroParte: 'PR-SPT-22', descripcion: 'Parrilla tipo panal en plástico ABS negro.', garantia: '6 meses' },
                { id: 8, nombre: 'Salpicadera Izquierda', precio: 1300, categoria: 'Carrocería', stock: 5, marca: 'MetalPro', numeroParte: 'SLP-IZQ-01', descripcion: 'Lámina de salpicadera con recubrimiento anticorrosivo.', garantia: '12 meses' },
                { id: 9, nombre: 'Calavera Trasera LED', precio: 1600, categoria: 'Iluminación', stock: 10, marca: 'LightVision', numeroParte: 'CLV-LED-08', descripcion: 'Calavera trasera con tecnología LED de alta visibilidad.', garantia: '12 meses' },
                { id: 10, nombre: 'Fascia Trasera Hatchback', precio: 1450, categoria: 'Colisión', stock: 3, marca: 'AutoPartes Pro', numeroParte: 'FS-HTB-05', descripcion: 'Fascia de poliuretano flexible, resistente a impactos ligeros.', garantia: '12 meses' }
            ];
            localStorage.setItem(this.KEYS.PRODUCTOS, JSON.stringify(productosIniciales));
        }
        if (!localStorage.getItem(this.KEYS.USUARIOS)) {
            const usuariosBase = [
                {
                    id_usuario: 1,
                    nombre_completo: 'Administrador Vertex',
                    correo: 'admin@vertex.com',
                    telefono: '0000000000',
                    contrasena: 'admin123',
                    rol: 'admin'
                }
            ];
            localStorage.setItem(this.KEYS.USUARIOS, JSON.stringify(usuariosBase));
        }
        if (!localStorage.getItem(this.KEYS.CARRITO)) {
            localStorage.setItem(this.KEYS.CARRITO, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.PEDIDOS)) {
            localStorage.setItem(this.KEYS.PEDIDOS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.MARCAS)) {
            const marcasAuto = [
                { id_marca_auto: 1, nombre_marca: 'Nissan', estatus: 1 },
                { id_marca_auto: 2, nombre_marca: 'Volkswagen', estatus: 1 },
                { id_marca_auto: 3, nombre_marca: 'Chevrolet', estatus: 1 }
            ];
            localStorage.setItem(this.KEYS.MARCAS, JSON.stringify(marcasAuto));
        }

        if (!localStorage.getItem(this.KEYS.MODELOS)) {
            const modelosAuto = [
                { id_modelo_auto: 1, id_marca_auto: 1, nombre_modelo: 'Versa' },
                { id_modelo_auto: 2, id_marca_auto: 2, nombre_modelo: 'Jetta' },
                { id_modelo_auto: 3, id_marca_auto: 3, nombre_modelo: 'Chevy' }
            ];
            localStorage.setItem(this.KEYS.MODELOS, JSON.stringify(modelosAuto));
        }

        if (!localStorage.getItem(this.KEYS.VEHICULOS)) {
            const vehiculos = [
                { id_vehiculo: 1, id_modelo_auto: 1, motor: '1.6L 4 Cilindros', anio_fabricacion: 2020 },
                { id_vehiculo: 2, id_modelo_auto: 2, motor: '2.0L 4 Cilindros', anio_fabricacion: 2018 },
                { id_vehiculo: 3, id_modelo_auto: 3, motor: '1.4L 4 Cilindros', anio_fabricacion: 2010 }
            ];
            localStorage.setItem(this.KEYS.VEHICULOS, JSON.stringify(vehiculos));
        }

        if (!localStorage.getItem(this.KEYS.COMPATIBILIDAD)) {
            const compatibilidad = [
                // Adaptamos el id_producto para usar los que ya tenemos en nuestro catálogo (1 al 10)
                { id_producto: 1, id_vehiculo: 1, comentario: 'Defensa compatible con anclajes de fábrica.' }, // Defensa Sedán para Versa
                { id_producto: 4, id_vehiculo: 2, comentario: 'Faro izquierdo con conexión directa.' }, // Faro para Jetta
                { id_producto: 2, id_vehiculo: 1, comentario: 'Manijas compatibles con puertas delanteras.' }, // Manijas para Versa
                { id_producto: 3, id_vehiculo: 3, comentario: 'Cofre metálico de encaje exacto.' } // Cofre para Chevy
            ];
            localStorage.setItem(this.KEYS.COMPATIBILIDAD, JSON.stringify(compatibilidad));
        }
    },

    obtenerProductos: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.PRODUCTOS)) || [];
    },

    obtenerCarrito: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.CARRITO)) || [];
    },

    guardarCarrito: function(carrito) {
        localStorage.setItem(this.KEYS.CARRITO, JSON.stringify(carrito));
    },

    agregarAlCarrito: function(idProducto) {
        const productos = this.obtenerProductos();
        // Buscamos el producto en el catálogo
        const producto = productos.find(p => p.id === parseInt(idProducto));
        if (!producto) return; // Si no existe, salimos

        const carrito = this.obtenerCarrito();
        // Verificamos si ya está en el carrito
        const itemExistente = carrito.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += 1; // Si existe, sumamos 1
        } else {
            carrito.push({ ...producto, cantidad: 1 }); // Si no, lo agregamos con cantidad 1
        }
        
        this.guardarCarrito(carrito);
    },

    actualizarCantidad: function(idProducto, nuevaCantidad) {
        let carrito = this.obtenerCarrito();
        
        if (nuevaCantidad <= 0) {
            this.eliminarDelCarrito(idProducto);
            return;
        }

        const item = carrito.find(item => item.id === parseInt(idProducto));
        if (item) {
            item.cantidad = parseInt(nuevaCantidad);
            this.guardarCarrito(carrito);
        }
    },

    eliminarDelCarrito: function(idProducto) {
        let carrito = this.obtenerCarrito();
        // Filtramos para conservar todos los que NO sean el id a eliminar
        carrito = carrito.filter(item => item.id !== parseInt(idProducto));
        this.guardarCarrito(carrito);
    },

    calcularTotal: function() {
        const carrito = this.obtenerCarrito();
        // Reduce suma el precio * cantidad de cada item, iniciando en 0
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    },

    registrarUsuario: function(datosUsuario) {
        const usuarios = JSON.parse(localStorage.getItem(this.KEYS.USUARIOS)) || [];
        
        // 1. Verificamos si el correo ya existe para evitar duplicados
        const existe = usuarios.find(u => u.correo === datosUsuario.correo);
        if (existe) {
            return false; // El registro falla porque el correo ya está en uso
        }

        // 2. Simulamos el id_usuario autoincremental del diagrama ER
        datosUsuario.id_usuario = usuarios.length > 0 ? usuarios[usuarios.length - 1].id_usuario + 1 : 1;
        datosUsuario.rol = 'cliente'
        
        // 3. Guardamos el nuevo usuario
        usuarios.push(datosUsuario);
        localStorage.setItem(this.KEYS.USUARIOS, JSON.stringify(usuarios));
        return true;
    },

    iniciarSesion: function(correo, contrasena) {
        const usuarios = JSON.parse(localStorage.getItem(this.KEYS.USUARIOS)) || [];
        
        // Buscamos un usuario que coincida con correo y contraseña
        const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
        
        if (usuario) {
            // Guardamos un objeto en la sesión con los datos básicos del usuario
            const datosSesion = {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre_completo
            };
            localStorage.setItem(this.KEYS.SESION, JSON.stringify(datosSesion));
            return true; // Login exitoso
        }
        return false; // Credenciales incorrectas
    },
    
    obtenerUsuarioActual: function() {
        const sesion = JSON.parse(localStorage.getItem(this.KEYS.SESION));
        if (!sesion) return null;
        
        const usuarios = JSON.parse(localStorage.getItem(this.KEYS.USUARIOS)) || [];
        return usuarios.find(u => u.id_usuario === sesion.id_usuario);
    },

    actualizarPerfil: function(id_usuario, nuevosDatos) {
        const usuarios = JSON.parse(localStorage.getItem(this.KEYS.USUARIOS)) || [];
        const indice = usuarios.findIndex(u => u.id_usuario === parseInt(id_usuario));
        
        if (indice !== -1) {
            // Actualizamos los campos simulando un UPDATE
            usuarios[indice].nombre_completo = nuevosDatos.nombre_completo;
            usuarios[indice].telefono = nuevosDatos.telefono;
            if (nuevosDatos.contrasena) {
                usuarios[indice].contrasena = nuevosDatos.contrasena;
            }
            
            localStorage.setItem(this.KEYS.USUARIOS, JSON.stringify(usuarios));
            
            // Reflejar el cambio de nombre en la sesión actual
            const sesion = JSON.parse(localStorage.getItem(this.KEYS.SESION));
            sesion.nombre = nuevosDatos.nombre_completo;
            localStorage.setItem(this.KEYS.SESION, JSON.stringify(sesion));
            return true;
        }
        return false;
    },
    procesarPedido: function(id_usuario) {
    const carrito = this.obtenerCarrito();
    if (carrito.length === 0) return { exito: false, mensaje: 'El carrito está vacío.' };

    let productos = this.obtenerProductos();
    
    // Paso A: Validar si hay stock suficiente ANTES de procesar
    for (let item of carrito) {
        const prodBD = productos.find(p => p.id === item.id);
        if (!prodBD || prodBD.stock < item.cantidad) {
            return { exito: false, mensaje: `Stock insuficiente para el producto: ${item.nombre}. Quedan ${prodBD ? prodBD.stock : 0} disponibles.` };
        }
    }

    // Paso B: Actualizar existencias descontando el stock comprado
    carrito.forEach(item => {
        const prodBD = productos.find(p => p.id === item.id);
        if(prodBD) prodBD.stock -= item.cantidad;
    });
    // Guardamos el nuevo inventario
    localStorage.setItem(this.KEYS.PRODUCTOS, JSON.stringify(productos));

    // Paso C: Generar el pedido
    const pedidos = JSON.parse(localStorage.getItem(this.KEYS.PEDIDOS)) || [];
    const nuevoPedido = {
        id_pedido: pedidos.length > 0 ? pedidos[pedidos.length - 1].id_pedido + 1 : 1001,
        id_usuario: parseInt(id_usuario),
        fecha: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        total: this.calcularTotal(),
        articulos: [...carrito], // Clonamos el arreglo para guardar el estado exacto
        estado: 'Procesado'
    };
    
    pedidos.push(nuevoPedido);
    localStorage.setItem(this.KEYS.PEDIDOS, JSON.stringify(pedidos));

    // Paso D: Vaciar el carrito
    localStorage.setItem(this.KEYS.CARRITO, JSON.stringify([]));

    return { exito: true, id_pedido: nuevoPedido.id_pedido };
    },

    obtenerPedidosUsuario: function(id_usuario) {
        const pedidos = JSON.parse(localStorage.getItem(this.KEYS.PEDIDOS)) || [];
        // Filtramos por usuario y usamos reverse() para mostrar los más recientes primero
        return pedidos.filter(p => p.id_usuario === parseInt(id_usuario)).reverse();
    },

    obtenerTabla: function(clave) {
        return JSON.parse(localStorage.getItem(this.KEYS[clave])) || [];
    },
    
    // Función que simula el cruce relacional
    obtenerProductosCompatibles: function(id_vehiculo) {
        const tablaCompatibilidad = this.obtenerTabla('COMPATIBILIDAD');
        const productos = this.obtenerProductos();
        
        // Filtramos la tabla puente por el id_vehiculo recibido
        const relaciones = tablaCompatibilidad.filter(c => c.id_vehiculo === parseInt(id_vehiculo));
        
        // Extraemos solo los IDs de los productos compatibles
        const idsCompatibles = relaciones.map(r => r.id_producto);
        
        // Retornamos los objetos de producto completos que coincidan con esos IDs
        return productos.filter(p => idsCompatibles.includes(p.id));
    },
    
    obtenerTodosLosPedidos: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.PEDIDOS)) || [];
    },

    // Obtener la lista de todos los usuarios registrados
    obtenerTodosLosUsuarios: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.USUARIOS)) || [];
    },

    // Agregar un nuevo producto al catálogo
    agregarProducto: function(nuevoProducto) {
        const productos = this.obtenerProductos();
        
        // Generamos un ID autoincremental buscando el ID más alto actual
        const maxId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) : 0;
        nuevoProducto.id = maxId + 1;
        
        productos.push(nuevoProducto);
        localStorage.setItem(this.KEYS.PRODUCTOS, JSON.stringify(productos));
        return true;
    },

    // Modificar un producto existente (incluyendo su stock)
    modificarProducto: function(productoActualizado) {
        let productos = this.obtenerProductos();
        const indice = productos.findIndex(p => p.id === parseInt(productoActualizado.id));
        
        if (indice !== -1) {
            // Reemplazamos el producto antiguo por el actualizado
            productos[indice] = productoActualizado;
            localStorage.setItem(this.KEYS.PRODUCTOS, JSON.stringify(productos));
            return true;
        }
        return false;
    },
    
    modificarEstadoPedido: function(idPedido, nuevoEstado) {
        let pedidos = this.obtenerTodosLosPedidos();
        const indice = pedidos.findIndex(p => p.id_pedido === parseInt(idPedido));
        
        if (indice !== -1) {
            pedidos[indice].estado = nuevoEstado;
            localStorage.setItem(this.KEYS.PEDIDOS, JSON.stringify(pedidos));
            return true;
        }
        return false;
    }

};
