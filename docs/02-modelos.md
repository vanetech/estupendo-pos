# Modelos de Datos Iniciales

## Usuario
- id
- nombre
- email
- rol (admin, cajero)
- timestamps

## Caja
- id
- fecha_apertura
- fecha_cierre
- monto_inicial
- monto_final
- usuario_id (quién abrió/cerró)
- timestamps

## Pedido
- id
- productos (relación con tabla productos)
- cantidad
- total
- estado (pendiente, entregado, cancelado)
- usuario_id
- timestamps

## Gastos
- id
- descripción
- monto
- tipo (arriendo, insumos, servicios)
- fecha
- timestamps

## Productos
- id
- nombre
- descripción
- precio
- stock
- timestamps
