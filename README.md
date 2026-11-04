# Vertex Collision - E-commerce Automotriz

**Desarrollado por:** José Francisco Aquino Rivera

Vertex Collision es una plataforma de comercio electrónico frontend enfocada en la venta de refacciones y carrocería para autos. Está diseñada con una estética profesional en modo oscuro y simula un flujo de compra completo.

## Tecnologías Utilizadas
* **HTML5:** Estructura semántica del sitio.
* **CSS3:** Estilos personalizados, CSS Grid, Flexbox y variables CSS para el manejo del tema oscuro.
* **JavaScript:** Lógica del negocio, manipulación del DOM, eventos y renderizado dinámico de la interfaz.
* **LocalStorage:** Simulación de base de datos relacional para la persistencia de datos.

## Instrucciones de Ejecución
Para visualizar y probar este proyecto correctamente en tu entorno local:

1. Clona o descarga este repositorio en tu computadora.
2. Abre la carpeta del proyecto en tu editor de código (se recomienda **Visual Studio Code**).
3. Instala la extensión **Live Server** en VS Code si aún no la tienes.
4. Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"**.
5. El proyecto se abrirá automáticamente en tu navegador predeterminado. 

## Funcionalidades Implementadas
* **Catálogo Dinámico y Búsqueda:** Listado de productos renderizado mediante JavaScript. Incluye una barra de búsqueda por texto y un filtro avanzado de **Compatibilidad de Vehículos**.
* **Carrito de Compras Interactivo:** Permite agregar productos, modificar cantidades, eliminar artículos y calcular automáticamente el subtotal y total. El contador del carrito en la barra de navegación se actualiza en tiempo real sin recargar la página.
* **Gestión de Usuarios:** Registro de nuevos clientes, inicio de sesión simulado, protección de rutas, cierre de sesión y perfil de usuario editable.
* **Historial de Pedidos:** Generación de órdenes de compra que reducen dinámicamente el stock del inventario. Visualización detallada de compras pasadas por usuario.
* **Panel de Administrador (Dashboard):** Vista protegida exclusivamente para el rol `admin`. Permite gestionar el inventario (agregar y modificar productos), actualizar el estado de los pedidos realizados y consultar la lista de usuarios registrados.

## Credenciales de Demostración del Administrador
Para acceder al Panel de Administrador (`admin.html`) y probar las funcionalidades de gestión de la tienda, utiliza las siguientes credenciales en la página de inicio de sesión:

* **Correo Electrónico:** `admin@vertex.com`
* **Contraseña:** `admin123`
