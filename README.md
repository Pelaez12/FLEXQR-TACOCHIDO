# FLEXQR · Taco Chido

Repositorio de la carta digital: https://github.com/Pelaez12/FLEXQR-TACOCHIDO.

Esta carpeta produce un sitio independiente de la landing `TACO-CHIDO`. Se reutilizan los componentes y estilos reales de la sección de carta de FLEXQR: tarjetas, búsqueda, categorías, personalización y barra de pedido. No contiene paneles, facturación ni administración.

```powershell
git clone https://github.com/Pelaez12/FLEXQR-TACOCHIDO.git
cd FLEXQR-TACOCHIDO
npm ci
npm run dev
```

Vista local: http://127.0.0.1:8093/. Compilar: `npm run build`. El Worker `cartachida` publica la carta en https://cartachida.comunidadfortaleza.com, separado de la landing. `npm run build` genera Workers Build Output en `.cloudflare/output/v0/`; `npm run deploy` publica esa compilación con `cf`. Cloudflare Workers Builds escucha la rama `main` de este repositorio y ejecuta ambos comandos. La compilación usa Node 24.22.1 y configuración en `cloudflare.config.ts`.

25 productos confirmados en `src/data/carta-data.ts`, organizados en seis categorías. Burrito de Pastor, Bowl Chido, Crema Volteada y las cuatro bebidas utilizan las fotos facilitadas; los otros 18 utilizan el logo. Bebidas: Tamarindo S/ 16, Horchata Mexa S/ 18, Jamaica S/ 16 y Limonada de coco S/ 18, con sus descripciones confirmadas. El texto de las opciones del Bowl Chido se conserva tal como lo proporcionó el usuario.

La marca usa los colores del manual, Montserrat local en pesos estáticos y SUPER LITTLE extraída del PDF solo para caracteres comprobados. Se ofrecen WOFF2 y TTF para compatibilidad con WebKit. El PDF nunca se carga como visor ni se utiliza para renderizar texto. `scripts/prepare-carta-fonts.py` regenera las fuentes a partir del manual y descarga Montserrat del repositorio oficial de Google Fonts.

El pedido se mantiene en memoria durante la visita. El botón «Realizar tu pedido aquí» abre WhatsApp de Taco Chido (946 247 918) con productos, subtotal y modalidad: mesa o para llevar. No agrega tarifas ni supone horarios. No envía mensajes automáticamente.

## Mesas y pedidos para llevar

- `/generadordequerys`: herramienta del restaurante para generar enlaces, oculta de la navegación del cliente y marcada `noindex, nofollow`. La compilación incluye `generadordequerys/index.html` para acceso directo en alojamientos estáticos. `/mesas.html` sigue funcionando como alias. Acepta el número de cualquier mesa entre 1 y 999, sin suponer cuántas mesas tiene el local. No requiere autenticación.
- `/?mesa=07`: abre automáticamente la carta con Mesa 07 en cabecera, resumen, carrito y mensaje de WhatsApp. El indicador de mesa tiene borde blanco y se puede pulsar para abrir «Elegir mesa», según la indicación actual del usuario para presentar el proyecto.
- «Elegir mesa» reutiliza el plano ilustrativo de FLEXQR: 20 mesas con sillas, cocina, caja y entrada; incluye selección visual, vista de lista y filtros por capacidad. La distribución está en `src/data/floor-plan.ts` para sustituirla por la real. No se pide escribir un número. Si una mesa válida del enlace no aparece en ese plano de ejemplo, se conserva y se ofrece como opción identificada por el enlace.
- `/?para_llevar=1`: muestra primero el aviso de recojo. Solo después de pulsar «Entendido, ver carta para llevar» se habilita la carta y el pedido. Cerrar con X o Escape no confirma la modalidad.
- `/`: utiliza las tarjetas, ilustraciones y estilos de modalidad existentes en FLEXQR. «En tu mesa» abre el mapa de mesas; «Para llevar» abre su aviso. Al elegir mesa se actualiza el parámetro `mesa` en el enlace normal, sin enlace ni modo de demostración aparte. QR y NFC con una mesa en la URL omiten esta elección inicial.
- Los parámetros repetidos, inválidos o incompatibles muestran una página 400. Estos enlaces identifican la mesa desde la URL; no son enlaces firmados ni sustituyen un control de acceso del servidor. La herramienta HTML no tiene autenticación.
- `/404.html` y las rutas desconocidas muestran la página 404 con la estructura y clases de FLEXQR; `/error.html` muestra la de error 500. Un límite de errores de React recupera fallos de renderizado con esa página. La compilación genera los HTML de carta, mesas y errores de forma independiente. El alojamiento debe configurar su respuesta HTTP 404 usando `404.html`.

El pie anuncia «Diseños de menú y carta digital · FLEXCOREOS» y contacto **992 272 521**. Ese contacto de diseño es distinto del WhatsApp del restaurante, que recibe los pedidos.

La carta permanece con `noindex` durante la revisión. Al confirmar su dominio, preparar canonical, sitemap y robots antes de habilitar indexación.

La entrada muestra el logo con una revelación gradual, el lema por líneas y un destello sobre ALEGRÍA, conservando el color crema del texto. El logo se traslada a la cabecera al terminar. Permite omitir con el botón o Escape y respeta movimiento reducido. El modo oscuro cambia tanto el fondo completo como las superficies y conserva la preferencia localmente.

La pantalla de selección tiene fondo negro continuo, logo centrado y no muestra el carrito. Los controles de tema y pedido aparecen al entrar a una modalidad. El logo vuelve a la selección sin recargar, conservando el pedido y la mesa del enlace; desde allí se puede elegir mesa o pedir para llevar.

Generador del restaurante: https://cartachida.comunidadfortaleza.com/generadordequerys. Ejemplo de mesa: https://cartachida.comunidadfortaleza.com/?mesa=01.

