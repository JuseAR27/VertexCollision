const SELECTORES_CATALOGO = {
  gridProductos: '#catalogoGrid, #contenedor-productos, #listaProductos, #productos-grid, .catalogo-grid, .productos-grid',
  inputBusqueda: 'input[placeholder*="Busca"], #inputBuscar, #buscador, input[type="search"], input[type="text"]'
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const estadoFiltro = {
    buscar: params.get('buscar') || '',
    categoria: params.get('categoria') || 'todas',
    marca: '',
    modelo: '',
    anio: '',
    motor: ''
  };
  asegurarContenedoresEnOrden();
  await configurarCascadaVehiculos(estadoFiltro);
  await renderizarBotonesCategorias(estadoFiltro);
  configurarBuscadorTexto(estadoFiltro);
  await cargarProductosCatalogo(estadoFiltro);
});

function asegurarContenedoresEnOrden() {
  const main = document.querySelector('main') || document.body;
  let grid = document.querySelector(SELECTORES_CATALOGO.gridProductos);

  if (!grid) {
    grid = document.createElement('div');
    grid.id = 'catalogoGrid';
    grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; max-width: 1140px; margin: 20px auto 50px auto; padding: 0 20px;';
    main.appendChild(grid);
  }

  let barraCategorias = document.getElementById('barra-categorias-catalogo');
  if (!barraCategorias) {
    barraCategorias = document.createElement('div');
    barraCategorias.id = 'barra-categorias-catalogo';
    barraCategorias.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; max-width: 1140px; margin: 16px auto 8px auto; padding: 0 20px; align-items: center;';
  }
  grid.parentNode.insertBefore(barraCategorias, grid);
}

async function configurarCascadaVehiculos(estadoFiltro) {
  const selects = Array.from(document.querySelectorAll('select'));
  if (selects.length < 4) return;

  const [selMarca, selModelo, selAnio, selMotor] = selects;
  let vehiculos = [];

  try {
    vehiculos = await VertexDB.obtenerVehiculos();
  } catch (err) {
    console.error('No se pudieron cargar los vehículos:', err);
    return;
  }

  const marcas = [...new Set(vehiculos.map((v) => v.nombre_marca))];
  selMarca.innerHTML = '<option value="">Selecciona</option>' +
    marcas.map((m) => `<option value="${m}">${m}</option>`).join('');
  selMarca.disabled = false;

  // Bloqueamos los selectores siguientes hasta que se elija el anterior
  const reiniciarSelect = (sel) => {
    sel.innerHTML = '<option value="">Selecciona</option>';
    sel.disabled = true;
    sel.removeAttribute('disabled');
    sel.disabled = true;
  };

  reiniciarSelect(selModelo);
  reiniciarSelect(selAnio);
  reiniciarSelect(selMotor);

  // Al elegir MARCA -> habilita MODELO
  selMarca.addEventListener('change', () => {
    const marca = selMarca.value;
    estadoFiltro.marca = marca;
    estadoFiltro.modelo = '';
    estadoFiltro.anio = '';
    estadoFiltro.motor = '';

    reiniciarSelect(selAnio);
    reiniciarSelect(selMotor);

    if (!marca) {
      reiniciarSelect(selModelo);
      return;
    }

    const modelos = [...new Set(
      vehiculos.filter((v) => v.nombre_marca === marca).map((v) => v.nombre_modelo)
    )];

    selModelo.innerHTML = '<option value="">Selecciona</option>' +
      modelos.map((mod) => `<option value="${mod}">${mod}</option>`).join('');
    selModelo.disabled = false;
    selModelo.removeAttribute('disabled');
  });

  // Al elegir MODELO -> habilita AÑO
  selModelo.addEventListener('change', () => {
    const marca = selMarca.value;
    const modelo = selModelo.value;
    estadoFiltro.modelo = modelo;
    estadoFiltro.anio = '';
    estadoFiltro.motor = '';

    reiniciarSelect(selMotor);

    if (!modelo) {
      reiniciarSelect(selAnio);
      return;
    }

    const anios = [...new Set(
      vehiculos
        .filter((v) => v.nombre_marca === marca && v.nombre_modelo === modelo)
        .map((v) => v.anio_fabricacion)
    )];

    selAnio.innerHTML = '<option value="">Selecciona</option>' +
      anios.map((a) => `<option value="${a}">${a}</option>`).join('');
    selAnio.disabled = false;
    selAnio.removeAttribute('disabled');
  });

  // Al elegir AÑO -> habilita MOTOR
  selAnio.addEventListener('change', () => {
    const marca = selMarca.value;
    const modelo = selModelo.value;
    const anio = selAnio.value;
    estadoFiltro.anio = anio;
    estadoFiltro.motor = '';

    if (!anio) {
      reiniciarSelect(selMotor);
      return;
    }

    const motores = [...new Set(
      vehiculos
        .filter((v) =>
          v.nombre_marca === marca &&
          v.nombre_modelo === modelo &&
          String(v.anio_fabricacion) === String(anio)
        )
        .map((v) => v.motor)
    )];

    selMotor.innerHTML = '<option value="">Selecciona</option>' +
      motores.map((mot) => `<option value="${mot}">${mot}</option>`).join('');
    selMotor.disabled = false;
    selMotor.removeAttribute('disabled');
  });

  // Al elegir MOTOR -> guarda valor
  selMotor.addEventListener('change', () => {
    estadoFiltro.motor = selMotor.value;
  });

  // Botón "Buscar piezas"
  const botones = Array.from(document.querySelectorAll('button'));
  const btnBuscar = botones.find((b) => b.textContent.toLowerCase().includes('buscar'));
  if (btnBuscar) {
    btnBuscar.disabled = false;
    btnBuscar.style.cursor = 'pointer';
    btnBuscar.addEventListener('click', (e) => {
      e.preventDefault();
      estadoFiltro.marca = selMarca.value;
      estadoFiltro.modelo = selModelo.value;
      estadoFiltro.anio = selAnio.value;
      estadoFiltro.motor = selMotor.value;
      cargarProductosCatalogo(estadoFiltro);
    });
  }
}

/**
 * Renderiza las categorías en la barra superior
 */
async function renderizarBotonesCategorias(estadoFiltro) {
  try {
    const categorias = await VertexDB.obtenerCategorias();
    const barra = document.getElementById('barra-categorias-catalogo');
    if (!barra) return;

    barra.innerHTML = [
      `<span style="color: #8b949e; font-size: 0.9rem; font-weight: bold; margin-right: 6px;">Categorías:</span>`,
      `<button type="button" data-cat="todas" style="padding: 8px 16px; border-radius: 20px; border: 1px solid ${estadoFiltro.categoria === 'todas' ? '#ff5722' : '#30363d'}; background: ${estadoFiltro.categoria === 'todas' ? '#ff5722' : '#161b22'}; color: #fff; cursor: pointer; font-weight: 600;">Todas</button>`,
      ...categorias.map((c) => {
        const esActiva = String(estadoFiltro.categoria) === String(c.id_categoria);
        return `
          <button type="button" data-cat="${c.id_categoria}" style="padding: 8px 16px; border-radius: 20px; border: 1px solid ${esActiva ? '#ff5722' : '#30363d'}; background: ${esActiva ? '#ff5722' : '#161b22'}; color: #fff; cursor: pointer; font-weight: 600;">
            ${c.nombre_categoria}
          </button>
        `;
      })
    ].join('');

    barra.querySelectorAll('button[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        estadoFiltro.categoria = btn.getAttribute('data-cat');
        renderizarBotonesCategorias(estadoFiltro);
        cargarProductosCatalogo(estadoFiltro);
      });
    });
  } catch (err) {
    console.error('Error al mostrar categorías:', err);
  }
}

/**
 * Conecta el buscador de texto con la consulta al servidor
 */
function configurarBuscadorTexto(estadoFiltro) {
  const input = document.querySelector(SELECTORES_CATALOGO.inputBusqueda);
  if (!input) return;

  if (estadoFiltro.buscar) input.value = estadoFiltro.buscar;

  input.addEventListener('input', (e) => {
    estadoFiltro.buscar = e.target.value;
    cargarProductosCatalogo(estadoFiltro);
  });
}

/**
 * Dibuja las tarjetas de productos en el catálogo
 */
async function cargarProductosCatalogo(estadoFiltro) {
  const grid = document.querySelector(SELECTORES_CATALOGO.gridProductos);
  if (!grid) return;

  try {
    const productos = await VertexDB.obtenerProductos(estadoFiltro);

    if (productos.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 36px; background: #161b22; border: 1px solid #262c36; border-radius: 10px;">
          <p style="color: #f0f6fc; font-size: 1.05rem; margin-bottom: 14px;">No se encontraron piezas para los filtros seleccionados.</p>
          <button id="btnRestablecerCatalogo" style="background: #ff5722; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Limpiar filtros y ver todo
          </button>
        </div>
      `;
      document.getElementById('btnRestablecerCatalogo')?.addEventListener('click', () => {
        window.location.href = 'catalogo.html';
      });
      return;
    }

    grid.innerHTML = productos.map((prod) => `
      <article class="producto-card product-card" style="background: #161b22; border: 1px solid #262c36; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; color: #f0f6fc;">
        <div>
          <img src="${prod.imagen}" alt="${prod.nombre_producto}" style="width: 100%; height: 170px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; background: #fff;">
          <span style="font-size: 0.78rem; color: #ff5722; font-weight: bold; text-transform: uppercase;">
            ${prod.nombre_categoria} | ${prod.nombre_fabricante}
          </span>
          <h3 style="margin: 8px 0; font-size: 1.1rem; color: #fff;">${prod.nombre_producto}</h3>
          <p style="font-size: 0.9rem; color: #8b949e; margin-bottom: 12px;">${prod.descripcion}</p>
        </div>
        <div>
          <p style="font-size: 1.25rem; font-weight: bold; color: #ffffff; margin: 8px 0;">$${Number(prod.precio_unitario).toFixed(2)} MXN</p>
          <p style="font-size: 0.85rem; color: ${prod.stock > 0 ? '#3fb950' : '#f85149'}; margin-bottom: 12px;">
            ${prod.stock > 0 ? `En existencia (${prod.stock} disponibles)` : 'Agotado'}
          </p>
          <a href="producto.html?id=${prod.id_producto}" style="display: block; text-align: center; background: #ff5722; color: #ffffff; padding: 10px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Ver detalle
          </a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    grid.innerHTML = `<p style="color: #f85149;">Error al cargar productos: ${err.message}</p>`;
  }
}