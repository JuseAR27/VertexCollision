# Vertex Collision - E-commerce Automotriz

**Desarrollado por:** José Francisco Aquino Rivera

Vertex Collision es una plataforma de comercio electrónico frontend enfocada en la venta de refacciones y carrocería para autos. Está diseñada con una estética profesional en modo oscuro y simula un flujo de compra completo.

## Tecnologías Utilizadas
* **HTML5:** Estructura semántica del sitio.
* **CSS3:** Estilos personalizados, CSS Grid, Flexbox y variables CSS para el manejo del tema oscuro.
* **JavaScript:** Lógica del negocio en el cliente, manipulación del DOM y consumo de la API REST.
* **Node.js y Express.js:** Servidor backend para la creación de la API REST y manejo de rutas.
* **SQLite:** Motor de base de datos relacional para la persistencia real de usuarios, productos, inventario y vehículos compatibles.

## Requisitos Previos
Para ejecutar este proyecto, asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu computadora.

## Instrucciones de Ejecución
Para visualizar y probar este proyecto correctamente en tu entorno local:

1. Clona o descarga este repositorio en tu computadora.
2. Abre la carpeta del proyecto en tu editor de código (se recomienda **Visual Studio Code**).
3. Abre una nueva terminal dentro del editor y ejecuta el siguiente comando para descargar las dependencias necesarias: npm install
4. Una vez finalizada la instalación, levanta el servidor ejecutando: npm start.
5. Abre tu navegador web predeterminado e ingresa a la direccion generada

## Funcionalidades Implementadas
* **Catálogo Dinámico y Búsqueda:** Listado de productos renderizado desde la base de datos. Incluye una barra de búsqueda por texto y un filtro avanzado relacional de **Compatibilidad de Vehículos**.
* **Carrito de Compras Interactivo:** Permite agregar productos, modificar cantidades y calcular automáticamente el total. El inventario se valida contra el stock real en SQLite.
* **Gestión de Usuarios:** Registro de nuevos clientes, inicio de sesión mediante validación en el servidor y protección de rutas.
* **Historial de Pedidos:** Generación de órdenes de compra que reducen dinámicamente el stock del inventario. Visualización detallada de compras pasadas por usuario.
* **Panel de Administrador (Dashboard):** Vista protegida exclusivamente para el rol `admin`. Permite gestionar el inventario (agregar y modificar productos), actualizar el estado de los pedidos realizados y consultar la lista de usuarios registrados.

## Credenciales de Demostración del Administrador
Para acceder al Panel de Administrador (`admin.html`) y probar las funcionalidades de gestión de la tienda, utiliza las siguientes credenciales en la página de inicio de sesión:

* **Correo Electrónico:** `admin@vertex.com`
* **Contraseña:** `admin123`
