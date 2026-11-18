const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const NOMBRE_ARCHIVO_DB = 'vertex_collision.db';
const dbPath = path.resolve(__dirname, NOMBRE_ARCHIVO_DB);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    inicializarBaseDeDatos();
  }
});

function inicializarBaseDeDatos() {
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON;');

    // 1. Tabla MARCA_AUTO
    db.run(`CREATE TABLE IF NOT EXISTS MARCA_AUTO (
      id_marca_auto INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_marca VARCHAR(100) NOT NULL,
      estatus TINYINT(1) DEFAULT 1
    )`);

    // 2. Tabla MODELO_AUTO
    db.run(`CREATE TABLE IF NOT EXISTS MODELO_AUTO (
      id_modelo_auto INTEGER PRIMARY KEY AUTOINCREMENT,
      id_marca_auto INTEGER NOT NULL,
      nombre_modelo VARCHAR(100) NOT NULL,
      FOREIGN KEY (id_marca_auto) REFERENCES MARCA_AUTO(id_marca_auto)
    )`);

    // 3. Tabla VEHICULO
    db.run(`CREATE TABLE IF NOT EXISTS VEHICULO (
      id_vehiculo INTEGER PRIMARY KEY AUTOINCREMENT,
      id_modelo_auto INTEGER NOT NULL,
      motor VARCHAR(50) NOT NULL,
      anio_fabricacion INTEGER NOT NULL,
      FOREIGN KEY (id_modelo_auto) REFERENCES MODELO_AUTO(id_modelo_auto)
    )`);

    // 4. Tabla CATEGORIA
    db.run(`CREATE TABLE IF NOT EXISTS CATEGORIA (
      id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_categoria VARCHAR(100) NOT NULL,
      descripcion VARCHAR(255)
    )`);

    // 5. Tabla MARCA_PRODUCTO
    db.run(`CREATE TABLE IF NOT EXISTS MARCA_PRODUCTO (
      id_marca_producto INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_fabricante VARCHAR(100) NOT NULL
    )`);

    // 6. Tabla PRODUCTO
    db.run(`CREATE TABLE IF NOT EXISTS PRODUCTO (
      id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
      id_categoria INTEGER NOT NULL,
      id_marca_producto INTEGER NOT NULL,
      nombre_producto VARCHAR(150) NOT NULL,
      descripcion TEXT,
      precio_unitario DECIMAL(10,2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      imagen VARCHAR(255) DEFAULT 'img/pieza.jpg',
      FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria),
      FOREIGN KEY (id_marca_producto) REFERENCES MARCA_PRODUCTO(id_marca_producto)
    )`);

    // 7. Tabla COMPATIBILIDAD_VEHICULO
    db.run(`CREATE TABLE IF NOT EXISTS COMPATIBILIDAD_VEHICULO (
      id_producto INTEGER NOT NULL,
      id_vehiculo INTEGER NOT NULL,
      comentario VARCHAR(255),
      PRIMARY KEY (id_producto, id_vehiculo),
      FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto) ON DELETE CASCADE,
      FOREIGN KEY (id_vehiculo) REFERENCES VEHICULO(id_vehiculo) ON DELETE CASCADE
    )`);

    // 8. Tabla USUARIO
    db.run(`CREATE TABLE IF NOT EXISTS USUARIO (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_completo VARCHAR(150) NOT NULL,
      correo VARCHAR(100) NOT NULL UNIQUE,
      contrasena VARCHAR(255) NOT NULL
    )`);

    // 9. Tabla ADMINISTRADOR
    db.run(`CREATE TABLE IF NOT EXISTS ADMINISTRADOR (
      id_usuario INTEGER PRIMARY KEY,
      rol_permiso VARCHAR(50) NOT NULL,
      FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
    )`);

    // 10. Tabla CLIENTE
    db.run(`CREATE TABLE IF NOT EXISTS CLIENTE (
      id_usuario INTEGER PRIMARY KEY,
      telefono VARCHAR(20),
      FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
    )`);

    // 11. Tabla DIRECCION
    db.run(`CREATE TABLE IF NOT EXISTS DIRECCION (
      id_direccion INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      codigo_postal VARCHAR(10) NOT NULL,
      ciudad VARCHAR(100) NOT NULL,
      calle VARCHAR(255) NOT NULL,
      FOREIGN KEY (id_usuario) REFERENCES CLIENTE(id_usuario) ON DELETE CASCADE
    )`);

    // 12. Tabla CARRITO
    db.run(`CREATE TABLE IF NOT EXISTS CARRITO (
      id_carrito INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      id_usuario INTEGER NOT NULL,
      FOREIGN KEY (id_usuario) REFERENCES CLIENTE(id_usuario) ON DELETE CASCADE
    )`);

    // 13. Tabla DETALLE_CARRITO
    db.run(`CREATE TABLE IF NOT EXISTS DETALLE_CARRITO (
      id_carrito INTEGER NOT NULL,
      id_producto INTEGER NOT NULL,
      cantidad_solicitada INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (id_carrito, id_producto),
      FOREIGN KEY (id_carrito) REFERENCES CARRITO(id_carrito) ON DELETE CASCADE,
      FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto) ON DELETE CASCADE
    )`);

    // 14. Tabla METODO_ENVIO
    db.run(`CREATE TABLE IF NOT EXISTS METODO_ENVIO (
      id_metodo_envio INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      costo_adicional DECIMAL(10,2) NOT NULL DEFAULT 0,
      activo TINYINT(1) DEFAULT 1
    )`);

    // 15. Tabla METODO_PAGO
    db.run(`CREATE TABLE IF NOT EXISTS METODO_PAGO (
      id_metodo_pago INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      activo TINYINT(1) DEFAULT 1
    )`);

    // 16. Tabla PEDIDO
    db.run(`CREATE TABLE IF NOT EXISTS PEDIDO (
      id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INTEGER NOT NULL,
      id_metodo_pago INTEGER NOT NULL,
      id_metodo_envio INTEGER NOT NULL,
      id_direccion INTEGER NOT NULL,
      fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_pagado DECIMAL(10,2) NOT NULL,
      estado_pedido VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
      FOREIGN KEY (id_usuario) REFERENCES CLIENTE(id_usuario),
      FOREIGN KEY (id_metodo_pago) REFERENCES METODO_PAGO(id_metodo_pago),
      FOREIGN KEY (id_metodo_envio) REFERENCES METODO_ENVIO(id_metodo_envio),
      FOREIGN KEY (id_direccion) REFERENCES DIRECCION(id_direccion)
    )`);

    // 17. Tabla DETALLE_PEDIDO
    db.run(`CREATE TABLE IF NOT EXISTS DETALLE_PEDIDO (
      id_pedido INTEGER NOT NULL,
      id_producto INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_historico DECIMAL(10,2) NOT NULL,
      PRIMARY KEY (id_pedido, id_producto),
      FOREIGN KEY (id_pedido) REFERENCES PEDIDO(id_pedido) ON DELETE CASCADE,
      FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto)
    )`);

    db.get('SELECT COUNT(*) AS total FROM PRODUCTO', (err, row) => {
      if (!err && row.total === 0) {
        insertarDatosSemilla();
      } else {
        console.log('Base de datos lista con', row ? row.total : 0, 'productos.');
      }
    });
  });
}

function insertarDatosSemilla() {
  console.log('Insertando datos iniciales en la base de datos...');

  db.serialize(() => {
    db.run('DELETE FROM COMPATIBILIDAD_VEHICULO');
    db.run('DELETE FROM PRODUCTO');
    db.run('DELETE FROM VEHICULO');
    db.run('DELETE FROM MODELO_AUTO');
    db.run('DELETE FROM MARCA_AUTO');
    db.run('DELETE FROM MARCA_PRODUCTO');
    db.run('DELETE FROM CATEGORIA');
    db.run('DELETE FROM CARRITO');
    db.run('DELETE FROM CLIENTE');
    db.run('DELETE FROM ADMINISTRADOR');
    db.run('DELETE FROM USUARIO');
    db.run('DELETE FROM METODO_ENVIO');
    db.run('DELETE FROM METODO_PAGO');

    // Insertar 4 Categorías
    const stmtCategoria = db.prepare('INSERT INTO CATEGORIA (id_categoria, nombre_categoria, descripcion) VALUES (?, ?, ?)');
    stmtCategoria.run(1, 'Fascias y Defensa', 'Fascias delanteras, traseras y refuerzos de impacto');
    stmtCategoria.run(2, 'Iluminación Automotriz', 'Faros principales, calaveras y faros de niebla');
    stmtCategoria.run(3, 'Lámina y Carrocería', 'Cofres, salpicaderas, puertas y paneles exteriores');
    stmtCategoria.run(4, 'Enfriamiento y Parrillas', 'Parrillas frontales, radiadores y tolvas');
    stmtCategoria.finalize();

    // Insertar 4 Marcas de fabricante
    const stmtFabricante = db.prepare('INSERT INTO MARCA_PRODUCTO (id_marca_producto, nombre_fabricante) VALUES (?, ?)');
    stmtFabricante.run(1, 'TYC');
    stmtFabricante.run(2, 'Tong Yang');
    stmtFabricante.run(3, 'Depo');
    stmtFabricante.run(4, 'Generacion OEM');
    stmtFabricante.finalize();

    // Insertar Marcas de auto, Modelos y Vehículos
    db.run("INSERT INTO MARCA_AUTO (id_marca_auto, nombre_marca, estatus) VALUES (1, 'Nissan', 1), (2, 'Chevrolet', 1), (3, 'Toyota', 1)");
    db.run("INSERT INTO MODELO_AUTO (id_modelo_auto, id_marca_auto, nombre_modelo) VALUES (1, 1, 'Versa'), (2, 2, 'Aveo'), (3, 3, 'Corolla')");
    db.run("INSERT INTO VEHICULO (id_vehiculo, id_modelo_auto, motor, anio_fabricacion) VALUES (1, 1, '1.6L L4', 2020), (2, 2, '1.5L L4', 2021), (3, 3, '1.8L L4', 2019)");

    // Insertar los productos destacados
    const productos = [
      [1, 1, 2, 'Fascia Delantera Nissan Versa', 'Fascia delantera lista para pintar con acabado primer.', 1850.00, 12, 'img/Fascia-Delantera-Nissan-Versa.webp'],
      [2, 1, 2, 'Fascia Trasera Chevrolet Aveo', 'Fascia trasera de poliuretano de alta resistencia.', 1690.00, 8, 'img/Fascia-Trasera-Chevrolet-Aveo.webp'],
      [3, 2, 1, 'Faro Principal Derecho LED Corolla', 'Faro óptico derecho con proyector de alta luminosidad.', 2450.00, 6, 'img/Faro-Principal-Derecho-LED-Corolla.webp'],
      [4, 2, 3, 'Juego de Calaveras Traseras Versa', 'Par de calaveras exteriores con arnés incluido.', 1920.00, 10, 'img/Juego-de-Calaveras-Traseras-Versa.webp'],
      [5, 3, 4, 'Cofre Delantero Acero Reforzado', 'Cofre estampado en lámina calibre OEM anticorrosión.', 3400.00, 4, 'img/pieza.jpg'],
      [6, 3, 2, 'Salpicadera Izquierda con Orificio', 'Salpicadera lateral delantera lado conductor.', 1150.00, 15, 'img/Salpicadera-Izquierda-con-Orificio.webp'],
      [7, 4, 2, 'Parrilla Central Cromada con Moldura', 'Parrilla frontal de plástico ABS con filos cromados.', 980.00, 20, 'img/Parrilla-Central-Cromada-con-Moldura.webp'],
      [8, 4, 1, 'Radiador de Aluminio Soldado', 'Radiador de enfriamiento para transmisión automática y manual.', 2100.00, 7, 'img/Radiador-de-Aluminio-Soldado.webp'],
      [9, 1, 4, 'Alma de Acero para Defensa Delantera', 'Refuerzo estructural interior contra colisión frontal.', 1540.00, 9, 'img/Alma-de-Acero-para-Defensa-Delantera.webp'],
      [10, 2, 3, 'Kit Faros de Niebla con Rejillas', 'Incluye par de faros de halógeno, biseles y cableado.', 1280.00, 14, 'img/Kit-Faros-de-Niebla-con-Rejillas.webp']
    ];

    const stmtProducto = db.prepare(`
      INSERT INTO PRODUCTO (id_producto, id_categoria, id_marca_producto, nombre_producto, descripcion, precio_unitario, stock, imagen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const stmtCompatibilidad = db.prepare(`
      INSERT INTO COMPATIBILIDAD_VEHICULO (id_producto, id_vehiculo, comentario)
      VALUES (?, ?, ?)
    `);

    productos.forEach((p, idx) => {
      stmtProducto.run(p);
      const idProducto = p[0];
      const idVehiculo = (idx % 3) + 1;
      stmtCompatibilidad.run(idProducto, idVehiculo, 'Ajuste directo sin modificaciones');
    });

    stmtProducto.finalize();
    stmtCompatibilidad.finalize();

    // Insertar 3 Usuarios iniciales
    db.run("INSERT INTO USUARIO (id_usuario, nombre_completo, correo, contrasena) VALUES (1, 'Admin Vertex', 'admin@vertex.com', 'admin123')");
    db.run("INSERT INTO ADMINISTRADOR (id_usuario, rol_permiso) VALUES (1, 'SUPERADMIN')");

    db.run("INSERT INTO USUARIO (id_usuario, nombre_completo, correo, contrasena) VALUES (2, 'Carlos Mendoza', 'carlos@correo.com', 'cliente123')");
    db.run("INSERT INTO CLIENTE (id_usuario, telefono) VALUES (2, '6311234567')");
    db.run("INSERT INTO CARRITO (id_usuario) VALUES (2)");

    db.run("INSERT INTO USUARIO (id_usuario, nombre_completo, correo, contrasena) VALUES (3, 'Laura Gómez', 'laura@correo.com', 'cliente123')");
    db.run("INSERT INTO CLIENTE (id_usuario, telefono) VALUES (3, '6319876543')");
    db.run("INSERT INTO CARRITO (id_usuario) VALUES (3)");

    // Insertar Métodos de Envío y Pago
    db.run("INSERT INTO METODO_ENVIO (nombre, costo_adicional, activo) VALUES ('Envío Estándar', 150.00, 1), ('Envío Express', 290.00, 1)");
    db.run("INSERT INTO METODO_PAGO (nombre, activo) VALUES ('Tarjeta de Crédito / Débito', 1), ('Transferencia SPEI', 1)", (err) => {
      if (!err) {
        console.log('¡Datos iniciales insertados correctamente en SQLite!');
      }
    });
  });
}

module.exports = db;