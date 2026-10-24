# Guía de diseño de la carta Taco Chido

## Uso
Personas que consultan la carta en su celular, en el local o desde redes. Deben reconocer el restaurante, encontrar un producto, leer su precio y armar una consulta de pedido sin perderse. En computadora se conserva la estructura de la carta FLEXQR.

## Identidad
Rojo del manual `#df2018`, amarillo `#ebae07` y crema `#fcf2e3`. Modo oscuro inicial: fondo `#101010`, tarjetas `#1b1b1b`, áreas de logo `#242424`, texto crema y texto secundario `#c7bfb5`. El encabezado conserva el rojo en ambos temas. Amarillo sobre fondo oscuro se usa para foco y acciones destacadas, con texto oscuro cuando el amarillo es el fondo.

## Cabecera
Logo auténtico centrado mediante columnas laterales de igual ancho. Cambio de tema a la izquierda, carrito amarillo a la derecha con icono y subtotal oscuros. El sol amarillo brillante y la luna crema clara aparecen sobre la cabecera roja, dentro de un borde negro circular de 2 px y con fondo transparente. Controles táctiles de al menos 44 px. El logo no se estira. La altura de cabecera es una variable compartida con las categorías adhesivas y el margen de desplazamiento de las secciones.

## Tipografía
Montserrat local estática 400, 600 y 700 para texto, precios y controles. SUPER LITTLE del manual para el título principal, con espaciado positivo y línea holgada. La Ó usa la O y el acento auténticos de la fuente para evitar mezclar familias. Ofrecer WOFF2 y TTF; nunca usar el PDF como renderizador de texto. Los campos usan al menos 16 px para evitar el zoom de entrada en iOS. No fijar alturas que recorten títulos o descripciones.

## Adaptación
Una columna de productos en móvil, cuadrícula de FLEXQR cuando hay espacio. El documento no debe desplazarse horizontalmente: únicamente la fila de categorías permite desplazamiento lateral. Verificar anchos de 320, 360, 390, 430, 768 y 1440 px y orientación horizontal. El carrito y las ventanas respetan la altura dinámica de pantalla y las áreas seguras.

Las bebidas usan fotos ampliadas a todo el ancho de sus tarjetas, con encuadre sobre el vaso. Al abrir cualquier producto, la imagen se presenta completa con `contain`, sin recortes. La ventana permite desplazamiento vertical, conserva el botón de cerrar visible y apila cantidad y botón de agregar en móviles estrechos.

## Modalidad y errores
Reutilizar `ServiceArtwork` y `order-flow.css` de FLEXQR para la entrada y sus dos opciones. Un enlace `?mesa=07` entra automáticamente a Mesa 07. Sin mesa, «En tu mesa» permite elegirla; pulsar la insignia blanca de la cabecera permite cambiarla. La elección actualiza la URL normal, sin modo de demostración aparte. Para llevar requiere aceptar y cerrar el aviso antes de abrir la carta. El carrito y WhatsApp identifican la modalidad. Los errores conservan la estructura y las clases de `NotFoundPage` de FLEXQR. La herramienta `mesas.html` genera enlaces y no se enlaza en la navegación de clientes. El contacto de diseños es FLEXCOREOS, 992 272 521; el de pedidos sigue siendo Taco Chido, 946 247 918.

La selección inicial usa una sola superficie negra en cabecera, contenido y pie, con el logo centrado y sin carrito ni cambio de tema. Al entrar a la carta reaparece la cabecera roja con controles. Pulsar el logo vuelve a la selección, conserva el borrador y la mesa asignada, limpia la búsqueda y devuelve el foco al título. El selector propone la mesa actual y permite confirmar otra.

No asignar una mesa sin que venga en el enlace o se confirme en el selector. El selector reutiliza el plano de FLEXQR, con cocina, caja, entrada, sillas, 20 mesas ilustrativas, vista de lista y filtro por capacidad. La mesa elegida se resalta antes de confirmar; no se escribe un número. Ajustar `src/data/floor-plan.ts` cuando se facilite el plano real. El contacto del pie se muestra en blanco y los iconos de los avisos de modalidad en rojo.

## Movimiento y accesibilidad
Entrada de marca con revelación del logo, aparición progresiva del lema por líneas, reflejo de luz sobre ALEGRÍA y traslado del logo a la cabecera. Toda la frase conserva su color crema, sin cambio a rojo. Duración aproximada de 5,3 segundos; omisible con botón o Escape y con una versión de fundidos para movimiento reducido. Microanimación breve del carrito al cambiar cantidades. Sin movimiento continuo decorativo. Foco visible, controles con nombres accesibles, ventana de producto con foco contenido, Escape y retorno de foco al cerrar. Mantener fotos, precios y nombres confirmados. Productos sin foto usan el logo.

## Validación
Revisar Chrome y WebKit con emulación móvil y escritorio: carga real de fuentes, título con Ó, logo centrado, carrito legible, desbordamiento, teclado, búsqueda, ventanas, movimiento reducido y temas. WebKit de Windows aproxima el motor de Safari; la emulación no sustituye una prueba en dispositivos físicos iOS/Android ni en navegadores internos de otras aplicaciones.
