const PREFIJO_PARTE = 'VTX-COL-';
const MESES_GARANTIA = '12 meses';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get('id') || '1';

  try {
    const producto = await VertexDB.obtenerProductoPorId(idProducto);
    rellenarVistaProducto(producto);
  } catch (error) {
    console.error('Error al cargar el detalle del producto:', error);
    const titulo = buscarPorSelectoresOTexto(
      ['#prod-title', '#nombre-producto', '#titulo-producto', 'main h1', 'main h2'],
      'Cargando producto'
    );
    if (titulo) {
      titulo.textContent = 'Producto no encontrado';
    }
  }
});

function buscarPorSelectoresOTexto(listaSelectores, textoInicial = '') {
  for (const selector of listaSelectores) {
    const elemento = document.querySelector(selector);
    if (elemento) return elemento;
  }

  if (textoInicial) {
    const todos = Array.from(document.querySelectorAll('main h1, main h2, main p, main span, main div, main li, main a'));
    return todos.find(
      (el) => el.children.length === 0 && el.textContent.trim().toLowerCase().includes(textoInicial.toLowerCase())
    );
  }
  return null;
}

/**
 * Inyecta toda la información en los campos de producto
 */
function rellenarVistaProducto(producto) {
  const hayStock = Number(producto.stock) > 0;
  const precioFormateado = `$${Number(producto.precio_unitario).toFixed(2)} MXN`;
  const numeroParte = `${PREFIJO_PARTE}${String(producto.id_producto).padStart(3, '0')}`;

  // Actualizar el título de la pestaña del navegador
  document.title = `${producto.nombre_producto} | Vertex Collision`;

  const breadCat = buscarPorSelectoresOTexto(
    ['#bread-categoria', '#breadcrumb-categoria', '#miga-categoria'],
    'Categoría'
  );
  if (breadCat) {
    breadCat.textContent = producto.nombre_categoria;
    if (breadCat.tagName === 'A') {
      breadCat.href = `catalogo.html?categoria=${producto.id_categoria}`;
    }
  }

  const breadProd = buscarPorSelectoresOTexto(
    ['#bread-nombre', '#bread-producto', '#breadcrumb-producto', '#miga-producto'],
    'Producto'
  );
  if (breadProd) {
    breadProd.textContent = producto.nombre_producto;
  }

  // Actualizar Imagen principal
  const imgProducto = document.querySelector(
    '#img-producto, #prod-img, #producto-img, #imagen-producto, main img'
  );
  if (imgProducto) {
    imgProducto.src = producto.imagen || 'img/pieza.jpg';
    imgProducto.alt = producto.nombre_producto;
  }

  // Actualizar Nombre / Título del producto
  const elTitulo = buscarPorSelectoresOTexto(
    ['#prod-title', '#nombre-producto', '#titulo-producto', '#producto-nombre', 'main h1'],
    'Cargando producto'
  );
  if (elTitulo) {
    elTitulo.textContent = producto.nombre_producto;
  }

  // Actualizar Precio
  const elPrecio = buscarPorSelectoresOTexto(
    ['#prod-price', '#precio-producto', '#producto-precio', '.precio-producto', '.precio'],
    '$0.00'
  );
  if (elPrecio) {
    elPrecio.textContent = precioFormateado;
  }

  // Actualizar Descripción breve
  const elDescripcion = buscarPorSelectoresOTexto(
    ['#prod-desc', '#descripcion-producto', '#producto-descripcion', '.descripcion-producto'],
    'Descripción breve del producto'
  );
  if (elDescripcion) {
    elDescripcion.textContent = producto.descripcion;
  }

  // Actualizar Garantía
  const elGarantia = document.querySelector('#garantia, #prod-garantia, #spec-garantia');
  if (elGarantia) {
    elGarantia.textContent = elGarantia.textContent.includes('Garantía')
      ? `Garantía de ${MESES_GARANTIA}`
      : MESES_GARANTIA;
  } else {
    const nodoGarantia = buscarPorSelectoresOTexto([], 'Garantía de');
    if (nodoGarantia) {
      nodoGarantia.textContent = `✔ Garantía de ${MESES_GARANTIA}`;
    }
  }

  // Actualizar Indicador de Stock
  const elStock = buscarPorSelectoresOTexto(
    ['#prod-stock', '#stock-producto', '#producto-stock', '#estado-stock'],
    'disponibles'
  );
  if (elStock) {
    const textoEstado = hayStock
      ? `En stock - ${producto.stock} disponibles`
      : 'Agotado - 0 disponibles';

    if (elStock.children.length > 0) {
      const ultimoNodo = Array.from(elStock.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
      );
      if (ultimoNodo) {
        ultimoNodo.textContent = ` ${textoEstado}`;
      } else {
        elStock.lastElementChild.textContent = textoEstado;
      }
    } else {
      elStock.textContent = textoEstado;
    }
  }

  // Actualizar Especificaciones Técnicas: Marca y Número de parte
  actualizarFilaEspecificacion(
    ['#spec-marca', '#marca-producto', '#producto-marca', '#ficha-marca'],
    'Marca',
    producto.nombre_fabricante
  );

  actualizarFilaEspecificacion(
    ['#spec-numero', '#numero-parte', '#sku-producto', '#ficha-numero', '#prod-sku'],
    'Número de parte',
    numeroParte
  );

  // Actualizar lista de Vehículos Compatibles
  actualizarListaCompatibilidad(producto.compatibilidades);

  // Conectar el botón "Agregar al carrito"
  const btnAgregar =
    document.querySelector('#prod-add-btn, #btn-add-cart, #btn-agregar-carrito, #btn-carrito') ||
    Array.from(document.querySelectorAll('main button')).find((b) =>
      b.textContent.toLowerCase().includes('carrito')
    );

  if (btnAgregar) {
    btnAgregar.disabled = !hayStock;
    btnAgregar.textContent = hayStock ? 'Agregar al carrito' : 'Sin existencia';

    btnAgregar.onclick = (e) => {
      e.preventDefault();
      VertexDB.agregarAlCarrito(producto, 1);
      alert(`¡"${producto.nombre_producto}" se agregó a tu carrito!`);
    };
  }
}

/**
 * Busca el campo de valor de una especificación técnica
 */
function actualizarFilaEspecificacion(selectoresId, textoEtiqueta, valorNuevo) {
  for (const sel of selectoresId) {
    const el = document.querySelector(sel);
    if (el) {
      el.textContent = valorNuevo;
      return;
    }
  }

  const posiblesEtiquetas = Array.from(document.querySelectorAll('main span, main div, main td, main th, main p'));
  const etiqueta = posiblesEtiquetas.find(
    (el) => el.children.length === 0 && el.textContent.trim().toLowerCase() === textoEtiqueta.toLowerCase()
  );

  if (etiqueta && etiqueta.nextElementSibling) {
    etiqueta.nextElementSibling.textContent = valorNuevo;
  }
}

/**
 * Inserta los vehículos compatibles desde SQLite conservando el estilo de la lista original
 */
function actualizarListaCompatibilidad(compatibilidades) {
  let contenedor = document.querySelector(
    '#spec-compatibilidad-list, #lista-compatibilidad, #compatibilidad-lista, #prod-compatibilidad, .lista-compatibilidad'
  );

  if (!contenedor) {
    const titulos = Array.from(document.querySelectorAll('main h3, main h4, main p, main div'));
    const tituloComp = titulos.find(
      (el) => el.children.length === 0 && el.textContent.trim().toLowerCase() === 'vehículos compatibles'
    );
    if (tituloComp && tituloComp.nextElementSibling) {
      contenedor = tituloComp.nextElementSibling;
    }
  }

  if (!contenedor) return;

  if (!compatibilidades || compatibilidades.length === 0) {
    return;
  }

  contenedor.innerHTML = compatibilidades
    .map(
      (c) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #c9d1d9;">
        <span>${c.nombre_marca} ${c.nombre_modelo} (${c.anio_fabricacion}) - Motor ${c.motor}</span>
        <span style="color: #7c3aed; font-weight: bold;">&#10004;</span>
      </div>
    `
    )
    .join('');
}