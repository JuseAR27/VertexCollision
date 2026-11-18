const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// POST /api/usuarios - Registrar nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre_completo, correo, contrasena, telefono } = req.body;

  if (!nombre_completo || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben completarse.' });
  }

  const sqlUsuario = 'INSERT INTO USUARIO (nombre_completo, correo, contrasena) VALUES (?, ?, ?)';
  db.run(sqlUsuario, [nombre_completo, correo.trim().toLowerCase(), contrasena], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
      }
      return res.status(500).json({ error: 'Error al registrar el usuario.' });
    }

    const nuevoId = this.lastID;
    db.run('INSERT INTO CLIENTE (id_usuario, telefono) VALUES (?, ?)', [nuevoId, telefono || '0000000000']);
    db.run('INSERT INTO CARRITO (id_usuario) VALUES (?)', [nuevoId]);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      usuario: {
        id_usuario: nuevoId,
        nombre_completo,
        correo: correo.trim().toLowerCase(),
        rol: 'cliente'
      }
    });
  });
});

// POST /api/auth/login - Iniciar sesión
app.post('/api/auth/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Ingresa tu correo y contraseña.' });
  }

  const sql = `
    SELECT u.id_usuario, u.nombre_completo, u.correo,
           a.rol_permiso, c.telefono
    FROM USUARIO u
    LEFT JOIN ADMINISTRADOR a ON u.id_usuario = a.id_usuario
    LEFT JOIN CLIENTE c ON u.id_usuario = c.id_usuario
    WHERE LOWER(u.correo) = LOWER(?) AND u.contrasena = ?
  `;

  db.get(sql, [correo.trim(), contrasena], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error interno al autenticar.' });
    if (!row) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      usuario: {
        id_usuario: row.id_usuario,
        nombre_completo: row.nombre_completo,
        correo: row.correo,
        telefono: row.telefono || '',
        rol: row.rol_permiso ? 'admin' : 'cliente',
        rol_permiso: row.rol_permiso || null
      }
    });
  });
});

// GET /api/categorias - Consultar categorías
app.get('/api/categorias', (req, res) => {
  db.all('SELECT * FROM CATEGORIA ORDER BY id_categoria ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al consultar las categorías.' });
    res.json(rows);
  });
});

// GET /api/vehiculos - Consultar marcas, modelos, años y motores
app.get('/api/vehiculos', (req, res) => {
  const sql = `
    SELECT v.id_vehiculo, ma.id_marca_auto, ma.nombre_marca,
           mo.id_modelo_auto, mo.nombre_modelo,
           v.anio_fabricacion, v.motor
    FROM VEHICULO v
    INNER JOIN MODELO_AUTO mo ON v.id_modelo_auto = mo.id_modelo_auto
    INNER JOIN MARCA_AUTO ma ON mo.id_marca_auto = ma.id_marca_auto
    WHERE ma.estatus = 1
    ORDER BY ma.nombre_marca ASC, mo.nombre_modelo ASC, v.anio_fabricacion DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al consultar vehículos.' });
    res.json(rows);
  });
});

// GET /api/productos - Consultar catálogo y filtrar por búsqueda, categoría o vehículo
app.get('/api/productos', (req, res) => {
  const { buscar, categoria, marca, modelo, anio, motor } = req.query;

  let sql = `
    SELECT DISTINCT p.id_producto, p.nombre_producto, p.descripcion,
           p.precio_unitario, p.stock, p.imagen,
           p.id_categoria, c.nombre_categoria,
           p.id_marca_producto, m.nombre_fabricante
    FROM PRODUCTO p
    INNER JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
    INNER JOIN MARCA_PRODUCTO m ON p.id_marca_producto = m.id_marca_producto
    LEFT JOIN COMPATIBILIDAD_VEHICULO cv ON p.id_producto = cv.id_producto
    LEFT JOIN VEHICULO v ON cv.id_vehiculo = v.id_vehiculo
    LEFT JOIN MODELO_AUTO mo ON v.id_modelo_auto = mo.id_modelo_auto
    LEFT JOIN MARCA_AUTO ma ON mo.id_marca_auto = ma.id_marca_auto
    WHERE 1 = 1
  `;
  const params = [];

  if (buscar && buscar.trim() !== '') {
    sql += ' AND (p.nombre_producto LIKE ? OR p.descripcion LIKE ? OR c.nombre_categoria LIKE ? OR m.nombre_fabricante LIKE ?)';
    const termino = `%${buscar.trim()}%`;
    params.push(termino, termino, termino, termino);
  }

  if (categoria && categoria !== 'todas') {
    sql += ' AND p.id_categoria = ?';
    params.push(categoria);
  }

  if (marca && marca.trim() !== '') {
    sql += ' AND ma.nombre_marca = ?';
    params.push(marca.trim());
  }

  if (modelo && modelo.trim() !== '') {
    sql += ' AND mo.nombre_modelo = ?';
    params.push(modelo.trim());
  }

  if (anio && anio.trim() !== '') {
    sql += ' AND CAST(v.anio_fabricacion AS TEXT) = ?';
    params.push(String(anio).trim());
  }

  if (motor && motor.trim() !== '') {
    sql += ' AND v.motor = ?';
    params.push(motor.trim());
  }

  sql += ' ORDER BY p.id_producto ASC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el catálogo de productos.' });
    res.json(rows);
  });
});

// GET /api/productos/:id - Consultar detalle completo de un producto y sus autos compatibles
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;

  const sqlProducto = `
    SELECT p.id_producto, p.nombre_producto, p.descripcion,
           p.precio_unitario, p.stock, p.imagen,
           p.id_categoria, c.nombre_categoria,
           p.id_marca_producto, m.nombre_fabricante
    FROM PRODUCTO p
    INNER JOIN CATEGORIA c ON p.id_categoria = c.id_categoria
    INNER JOIN MARCA_PRODUCTO m ON p.id_marca_producto = m.id_marca_producto
    WHERE p.id_producto = ?
  `;

  db.get(sqlProducto, [id], (err, producto) => {
    if (err) return res.status(500).json({ error: 'Error al consultar el producto.' });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado.' });

    const sqlCompatibilidad = `
      SELECT v.id_vehiculo, ma.nombre_marca, mo.nombre_modelo,
             v.anio_fabricacion, v.motor, cv.comentario
      FROM COMPATIBILIDAD_VEHICULO cv
      INNER JOIN VEHICULO v ON cv.id_vehiculo = v.id_vehiculo
      INNER JOIN MODELO_AUTO mo ON v.id_modelo_auto = mo.id_modelo_auto
      INNER JOIN MARCA_AUTO ma ON mo.id_marca_auto = ma.id_marca_auto
      WHERE cv.id_producto = ?
    `;

    db.all(sqlCompatibilidad, [id], (errComp, compatibilidades) => {
      producto.compatibilidades = errComp ? [] : compatibilidades;
      res.json(producto);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de Vertex Collision ejecutándose en http://localhost:${PORT}`);
});