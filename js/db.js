const API_BASE = '/api';
const SESION_KEY = 'vertex_sesion';
const CARRITO_KEY = 'vertex_carrito';

const VertexDB = {
  init() {
    if (!localStorage.getItem(CARRITO_KEY)) {
      localStorage.setItem(CARRITO_KEY, JSON.stringify([]));
    }
    return true;
  },

  normalizarProducto(p) {
    if (!p) return null;
    return {
      ...p,
      id: p.id_producto,
      nombre: p.nombre_producto,
      precio: Number(p.precio_unitario),
      categoria: p.nombre_categoria,
      marca: p.nombre_fabricante,
      imagen: p.imagen || 'img/pieza.jpg'
    };
  },

  normalizarUsuario(u) {
    if (!u) return null;
    const nombreFinal = u.nombre_completo || u.nombre || 'Usuario';
    const correoFinal = u.correo || u.email || '';
    const idFinal = u.id_usuario || u.id;
    const rolFinal = u.rol || u.role || 'cliente';

    return {
      ...u,
      id_usuario: idFinal,
      id: idFinal,
      nombre_completo: nombreFinal,
      nombre: nombreFinal,
      correo: correoFinal,
      email: correoFinal,
      telefono: u.telefono || '',
      rol: rolFinal,
      role: rolFinal
    };
  },

  async obtenerCategorias() {
    const res = await fetch(`${API_BASE}/categorias`);
    if (!res.ok) throw new Error('Error al cargar categorías');
    return await res.json();
  },

  async obtenerVehiculos() {
    const res = await fetch(`${API_BASE}/vehiculos`);
    if (!res.ok) throw new Error('Error al cargar vehículos');
    return await res.json();
  },

  async obtenerProductos(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.buscar && filtros.buscar.trim() !== '') params.append('buscar', filtros.buscar.trim());
    if (filtros.categoria && filtros.categoria !== 'todas') params.append('categoria', filtros.categoria);
    if (filtros.marca) params.append('marca', filtros.marca);
    if (filtros.modelo) params.append('modelo', filtros.modelo);
    if (filtros.anio) params.append('anio', filtros.anio);
    if (filtros.motor) params.append('motor', filtros.motor);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/productos${query}`);
    if (!res.ok) throw new Error('Error al consultar productos');

    const productos = await res.json();
    return productos.map((p) => this.normalizarProducto(p));
  },

  async obtenerProductoPorId(id) {
    const res = await fetch(`${API_BASE}/productos/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    const producto = await res.json();
    return this.normalizarProducto(producto);
  },

  async registrarUsuario(datos) {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const resultado = await res.json();
    if (!res.ok) throw new Error(resultado.error || 'Error al registrar usuario');
    return resultado;
  },

  async iniciarSesion(correo, contrasena) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena })
    });
    const resultado = await res.json();
    if (!res.ok) throw new Error(resultado.error || 'Credenciales incorrectas');

    const usuarioNormalizado = this.normalizarUsuario(resultado.usuario);
    localStorage.setItem(SESION_KEY, JSON.stringify(usuarioNormalizado));
    return usuarioNormalizado;
  },

  obtenerSesionActual() {
    const sesion = localStorage.getItem(SESION_KEY);
    if (!sesion) return null;
    try {
      const usuario = this.normalizarUsuario(JSON.parse(sesion));
      // Guardamos la versión normalizada por si venía de una sesión previa
      localStorage.setItem(SESION_KEY, JSON.stringify(usuario));
      return usuario;
    } catch (e) {
      return null;
    }
  },

  cerrarSesion() {
    localStorage.removeItem(SESION_KEY);
  },

  obtenerCarrito() {
    const carrito = localStorage.getItem(CARRITO_KEY);
    return carrito ? JSON.parse(carrito) : [];
  },

  agregarAlCarrito(producto, cantidad = 1) {
    const carrito = this.obtenerCarrito();
    const idProd = producto.id_producto || producto.id;
    const existente = carrito.find((item) => (item.id_producto || item.id) === idProd);

    if (existente) {
      existente.cantidad = (existente.cantidad || 1) + cantidad;
    } else {
      carrito.push({ ...this.normalizarProducto(producto), cantidad });
    }
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));

    if (typeof window.actualizarContadorCarrito === 'function') {
      window.actualizarContadorCarrito();
    }
    return carrito;
  },

  // Alias de compatibilidad para scripts existentes
  getSession() { return this.obtenerSesionActual(); },
  logout() { return this.cerrarSesion(); },
  getCart() { return this.obtenerCarrito(); },
  getCarrito() { return this.obtenerCarrito(); },
  addToCart(prod, cant) { return this.agregarAlCarrito(prod, cant); },
  getCategorias() { return this.obtenerCategorias(); },
  getVehiculos() { return this.obtenerVehiculos(); },
  getProductos(f) { return this.obtenerProductos(f); },
  getProductoById(id) { return this.obtenerProductoPorId(id); },
  registrar(d) { return this.registrarUsuario(d); },
  login(c, p) { return this.iniciarSesion(c, p); }
};

window.VertexDB = VertexDB;