# Inventario de Remedios con App Script
Automatización de una hoja de cálculo de Google para gestionar el inventario de remedios en un hogar de ancianos, utilizando Google Sheets y Google App Script.

## Créditos

Este proyecto fue desarrollado en conjunto con mis compañeros de carrera **Martina Álvarez** y **Mauro Castillo**, en el contexto de una asignatura universitaria.

## Funcionalidades

- Creación automática de hoja para cada residente.
- Control de dosis diaria por medicamento.
- Cálculo de fecha estimada de reposición.
- Registro del último trabajador que editó.
- Buscador de hoja por nombre de residente.
- Plantilla reutilizable y fácil de mantener.
  
## Tecnologías utilizadas

- Google Sheets
- Google App Script (JavaScript)

## Cómo usar

1. Abre una hoja de cálculo de Google llamada `Residentes`, con las siguientes columnas:
   - Nombre completo
   - RUT

2. Ve a `Extensiones > Apps Script` y pega el contenido del archivo `inventario.gs` desde la carpeta `codigos/`.

3. Guarda y autoriza los permisos solicitados.

4. Al ingresar el nombre y RUT de un nuevo residente en la hoja principal, se generará automáticamente una hoja con su nombre. Esta hoja tendrá el siguiente formato:

   - Nombre del Medicamento  
   - Dosis Diaria  
   - Gramaje Medicamento  
   - Inventario Existente  
   - Última Fecha Ingreso  
   - Duración Tratamiento  
   - Fecha Próxima a Traer *(calculada automáticamente)*  
   - Último trabajador que editó *(solo si el correo es institucional)*
     
## Estructura

- `codigos/`: contiene el código de App Script.
- `ejemplo/`: incluye una plantilla de ejemplo con datos ficticios.

## Notas

- Los datos incluidos en el dummy son ficticios y solo se usan como demostración del funcionamiento.
