# 🍕 Manual de Usuario: Estupendo POS

¡Bienvenido a **Estupendo POS**! Este sistema fue diseñado especialmente para gestionar operaciones de ventas (como pizzerías o restaurantes comerciales) de manera rápida, segura, y mediante una interfaz moderna.

## 🚀 1. Primeros Pasos

Para interactuar con el sistema localmente, el servidor base debe estar encendido.
Asumiendo que utilizamos Docker, simplemente abre tu terminal en el directorio del proyecto y ejecuta:

```bash
docker-compose up -d app db
```

Una vez en ejecución, ingresa desde tu navegador web y visita:
👉 **[http://localhost:8000/pos](http://localhost:8000/pos)**

---

## 💻 2. Módulos del Sistema

La herramienta está diseñada para brindar fluidez en cada operación comercial del día. Se divide en 5 áreas claves accesibles permanentemente desde el menú lateral.

### 💵 A. Turnos de Caja
> **Ubicación:** `/cash-shifts`

**¡Este es el punto de partida diario!** Por seguridad estricta, el sistema impedirá que se registren ventas en la terminal POS si el usuario no ha abierto formalmente su turno.

1. **Abrir Caja:** Selecciona tu caja registradora principal e ingresa el **Monto Inicial** (la base en efectivo de facturas/monedas con la que arrancas). Presiona "Abrir Turno".
2. **Estado en Vivo:** El sistema alertará visualmente, en color verde, que la sesión ha iniciado.
3. **Cierre y Cuadre de Caja:** Al terminar la jornada de trabajo laboral o de empleado, se debe ejecutar un Cierre de Turno. Ingresa el monto físico real que contabilizas con tus propias manos (*Monto Declarado*). El sistema, en background, calculará cuánto debió haber quedado y te mostrará instantáneamente el cuadro cruzado (Diferencias, Sobrantes o Faltantes).

### 🛍️ B. Terminal POS
> **Ubicación:** `/pos`

El corazón del sistema. Aquí es donde los empleados y administradores registran pedidos extremadamente rápidos.

1. **Catálogo Dinámico:** Del lado izquierdo, observarás la grilla de productos disponibles. Haz un simple clic sobre un producto (Ej. "Pizza Peperoni") para auto-agregarlo al recibo de la derecha.
2. **Edición Express:** Sobre el carrito puedes sumar (`+`) o restar (`-`) unidades con un tap. Para borrar algo que el cliente declinó, pasa el mouse y usa el logo de la papelera de reciclaje. El saldo suma en tiempo real.
3. **Efectuar Cobro:** En la parte inferior, elige en el menú desplegable cómo va a pagar tu cliente (Efectivo, Tarjeta, Nequi/Transferencia) y confirma dando clic en **"Cobrar Orden"**. ¡Todo ingresa automáticamente a la caja y tu inventario desciende en unísono!

### 📦 C. Productos e Inventarios
> **Ubicación:** `/products`

El módulo de mantenimiento de ítems de tu tienda.
1. **Auditoría:** Observa toda tu mercancía. Detecta qué productos gozan de estatus activo o niveles de existencia (inventarios) a través de distintivos de color (Verde/Rojo).
2. **Ingreso:** Presiona "+ Nuevo Producto" para incluir nombres, el precio venta público (PVP) y el costo bruto (lo cual servirá más adelante para conocer tu margen real) más el Stock.

### 📉 D. Gastos y Egresos Operativos
> **Ubicación:** `/expenses`

Esencial para que el sistema mantenga finanzas claras y la caja concuerde milimétricamente.
1. Reporta las salidas de dinero justificadas (Ej. *Pago de Luz, Insumos urgentes de Tomate, Nómina o Alquiler del Local*).
2. Agrega la descripción, escoge a cuál categoría contable pertenece y presiona **"Guardar Gasto"**. Al hacer esto en el día actual, ese monto de dinero afectará y se descontará para el cierre de la caja.

### 📊 E. Reportes Contables Financieros
> **Ubicación:** `/reports`

El salpicadero (Dashboard) preferido de la Gerencia Integral.
1. Observa de un único vistazo cómo avanza tu rentabilidad financiera mediante números de alto impacto visual.
2. El reporte enfrenta orgánicamente tu **Total de Ventas Brutas** vs todo tu **Total de Gastos Históricos** para regalarte la métrica reina que importa: Tu **Utilidad Neta** u operación líquida generada.

---
*Desarrollado para escalar negocios hacia el éxito.*
