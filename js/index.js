const REDIRIGIR_AL_CATALOGO_AL_ENVIAR = false;
const LIMITE_PRODUCTOS_HOME = 10;
const TEXTO_PLACEHOLDER_BUSCADOR = 'Busca refacciones por nombre, categoría o marca (ej. Fascia, Faro, Versa)...';

const SELECTORES_HOME = {
  productos: '#contenedor-productos, #productosDestacados, #favoritosGrid, #catalogoGrid, .productos-grid, .grid-productos, .cards-container',
  categorias: '#contenedor-categorias, #categoriasHome, .categorias-grid',
  buscadorExistente: '#inputBuscarHome, #buscadorHome, main input[type="search"], main input[type="text"]'
};

document.addEventListener('DOMContentLoaded', async () => {
  await inicializarPaginaPrincipal();
});

/**
 * Coordina la creación de los contenedores, la barra de búsqueda, las categorías y los productos.
 */
async function inicializarPaginaPrincipal() {
  try {
    const { contenedorProd, contenedorCat } = prepararEstructuraHome();
    configurarBuscadorHome(contenedorCat, contenedorProd);
    const [categorias, productos] = await Promise.all([
      VertexDB.obtenerCategorias(),
      VertexDB.obtenerProductos()
    ]);

    renderizarCategoriasHome(contenedorCat, categorias);
    renderizarProductosHome(contenedorProd, productos);
  } catch (error) {
    console.error('Error al inicializar la página principal:', error);
  }
}

/**
 * Asegura que existan los contenedores para categorías y productos.
 */
function prepararEstructuraHome() {
  let contenedorProd = document.querySelector(SELECTORES_HOME.productos);

  if (!contenedorProd) {
    const seccionFavoritos = document.querySelector('main section:last-of-type') || document.querySelector('main') || document.body;
    contenedorProd = document.createElement('div');
    contenedorProd.id = 'contenedor-productos-dinamico';
    contenedorProd.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; max-width: 1200px; margin: 25px auto 40px auto; padding: 0 20px;';
    seccionFavoritos.appendChild(contenedorProd);
  }

  let contenedorCat = document.querySelector(SELECTORES_HOME.categorias);
  if (!contenedorCat && contenedorProd.parentElement) {
    contenedorCat = document.createElement('div');
    contenedorCat.id = 'contenedor-categorias-dinamico';
    contenedorCat.style.cssText = 'display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 1200px; margin: 18px auto; padding: 0 20px;';
    contenedorProd.parentElement.insertBefore(contenedorCat, contenedorProd);
  }

  return { contenedorProd, contenedorCat };
}

/**
 * Crea la barra de búsqueda en la página principal y conecta sus eventos con el backend.
 */
function configurarBuscadorHome(contenedorCat, contenedorProd) {
  let inputBusqueda = document.querySelector(SELECTORES_HOME.buscadorExistente);
  let formBusqueda = document.getElementById('form-buscador-home');
  if (!inputBusqueda && contenedorCat && contenedorCat.parentElement) {
    const wrapperBuscador = document.createElement('div');
    wrapperBuscador.id = 'wrapper-buscador-home';
    wrapperBuscador.style.cssText = 'max-width: 820px; margin: 24px auto 18px auto; padding: 0 20px;';

    wrapperBuscador.innerHTML = `
      <form id="form-buscador-home" style="display: flex; gap: 10px; background: #161b22; border: 1px solid #30363d; padding: 8px 12px; border-radius: 10px; align-items: center;">
        <input
          type="search"
          id="inputBuscarHome"
          placeholder="${TEXTO_PLACEHOLDER_BUSCADOR}"
          style="flex: 1; background: transparent; border: none; color: #f0f6fc; font-size: 0.98rem; padding: 8px; outline: none;"
        >
        <button
          type="submit"
          style="background: #ff5722; color: #ffffff; border: none; padding: 10px 22px; border-radius: 7px; font-weight: bold; cursor: pointer; font-size: 0.95rem;"
        >
          Buscar
        </button>
      </form>
    `;

    contenedorCat.parentElement.insertBefore(wrapperBuscador, contenedorCat);
    inputBusqueda = document.getElementById('inputBuscarHome');
    formBusqueda = document.getElementById('form-buscador-home');
  }

  if (!inputBusqueda) return;

  // Filtrado en la página principal mientras el usuario escribe
  inputBusqueda.addEventListener('input', async (e) => {
    const termino = e.target.value;
    try {
      const productosFiltrados = await VertexDB.obtenerProductos({ buscar: termino });
      renderizarProductosHome(contenedorProd, productosFiltrados, termino);
    } catch (err) {
      console.error('Error al buscar productos en el Home:', err);
    }
  });

  // Al presionar Enter o dar clic en el botón "Buscar"
  if (formBusqueda) {
    formBusqueda.addEventListener('submit', async (e) => {
      e.preventDefault();
      const termino = inputBusqueda.value.trim();

      if (REDIRIGIR_AL_CATALOGO_AL_ENVIAR && termino !== '') {
        window.location.href = `catalogo.html?buscar=${encodeURIComponent(termino)}`;
        return;
      }

      const productosFiltrados = await VertexDB.obtenerProductos({ buscar: termino });
      renderizarProductosHome(contenedorProd, productosFiltrados, termino);
    });
  }
}

/**
 * Dibuja los botones de las categorías en la pagina principal.
 */
function renderizarCategoriasHome(contenedorCat, categorias) {
  if (!contenedorCat) return;

  contenedorCat.innerHTML = categorias.map((c) => `
    <a href="catalogo.html?categoria=${c.id_categoria}" style="background: #161b22; border: 1px solid #30363d; color: #ff5722; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: bold;">
      ${c.nombre_categoria}
    </a>
  `).join('');
}

/**
 * Dibuja las tarjetas de los productos destacados o los resultados de búsqueda en la pagina principal.
 */
function renderizarProductosHome(contenedorProd, productos, terminoBuscado = '') {
  if (!contenedorProd) return;

  if (productos.length === 0) {
    contenedorProd.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 32px; background: #161b22; border: 1px solid #262c36; border-radius: 10px; color: #f0f6fc;">
        <p style="font-size: 1.05rem; margin-bottom: 12px;">
          No se encontraron refacciones que coincidan con "<strong>${terminoBuscado}</strong>".
        </p>
        <button id="btnLimpiarBusquedaHome" style="background: #ff5722; color: #ffffff; border: none; padding: 9px 18px; border-radius: 6px; font-weight: bold; cursor: pointer;">
          Ver todos los productos destacados
        </button>
      </div>
    `;

    document.getElementById('btnLimpiarBusquedaHome')?.addEventListener('click', async () => {
      const input = document.getElementById('inputBuscarHome');
      if (input) input.value = '';
      const todos = await VertexDB.obtenerProductos();
      renderizarProductosHome(contenedorProd, todos);
    });
    return;
  }

  contenedorProd.innerHTML = productos.slice(0, LIMITE_PRODUCTOS_HOME).map((p) => `
    <article class="producto-card" style="background: #161b22; border: 1px solid #262c36; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; color: #f0f6fc;">
      <div>
        <img src="${p.imagen}" alt="${p.nombre_producto}" style="width: 100%; height: 170px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; background: #ffffff;">
        <span style="font-size: 0.8rem; color: #ff5722; text-transform: uppercase; font-weight: bold;">${p.nombre_categoria}</span>
        <h3 style="margin: 8px 0; font-size: 1.1rem; color: #ffffff;">${p.nombre_producto}</h3>
        <p style="font-size: 0.9rem; color: #8b949e; margin-bottom: 12px;">${p.descripcion}</p>
      </div>
      <div>
        <p style="font-size: 1.25rem; font-weight: bold; color: #ffffff; margin: 8px 0;">$${Number(p.precio_unitario).toFixed(2)} MXN</p>
        <p style="font-size: 0.85rem; color: ${p.stock > 0 ? '#3fb950' : '#f85149'}; margin-bottom: 12px;">
          ${p.stock > 0 ? `Disponible (${p.stock} en stock)` : 'Agotado'}
        </p>
        <a href="producto.html?id=${p.id_producto}" style="display: block; text-align: center; background: #ff5722; color: #ffffff; padding: 10px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Ver detalle
        </a>
      </div>
    </article>
  `).join('');
}