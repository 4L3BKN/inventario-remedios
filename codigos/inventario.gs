function onEdit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = e.range.getSheet();
  const hojaResidentes = "Residentes";
  const fila = e.range.getRow();
  const col = e.range.getColumn();
  const nombreHoja = hoja.getName();

  // 1. CREAR NUEVA HOJA AL AGREGAR RESIDENTE EN HOJA PRINCIPAL
  if (nombreHoja === hojaResidentes && (col === 1 || col === 2)) {
    const fila = e.range.getRow();
    const nombreResidente = ss.getSheetByName(hojaResidentes).getRange(fila, 1).getValue().toString().trim();
    if (!nombreResidente) return;

    const rutResidente = ss.getSheetByName(hojaResidentes).getRange(fila, 2).getValue().toString().trim();
    if (!rutResidente) { return; }
    
    const rutLimpio = rutResidente.toString().replace(/[.]/g, '').toUpperCase();

    const hojas = ss.getSheets();
    for (let i = 0; i < hojas.length; i++) {
      const celdaRut = hojas[i].getRange("A2").getValue().toString().replace(/[.\-\s]/g, '').toUpperCase();
      if (celdaRut === rutLimpio) {
        Logger.log("Ya existe hoja con este RUT");
        return; // ya existe hoja con este rut
      }
    }

    const nombreHojaNueva = `${nombreResidente}`;
    const nuevaHoja = ss.insertSheet(nombreHojaNueva);

    // Encabezado con nombre del residente
    nuevaHoja.getRange("A1").setValue("Nombre del Residente: " + nombreResidente).setFontWeight("bold").setFontSize(12);
    // Agregar rut a la hoja
    nuevaHoja.getRange("A2").setValue("RUT: " + rutResidente).setFontWeight("bold").setFontSize(10);

    // Títulos y formato
    const encabezados = [
      "Nombre del Medicamento",
      "Dosis Diaria",
      "Gramaje Medicamento",
      "Inventario Existente",
      "Última Fecha Ingreso",
      "Duración Tratamiento",
      "Fecha Próxima a Traer",
      "Último trabajador editó"
    ];
    const rangoEncabezados = nuevaHoja.getRange(3, 1, 1, encabezados.length);
    rangoEncabezados.setValues([encabezados]).setFontWeight("bold").setBackground("#DCE6F1");

    // Ancho de columnas
    const anchos = [250, 120, 150, 130, 170, 170, 170, 200];
    anchos.forEach((ancho, index) => nuevaHoja.setColumnWidth(index + 1, ancho));

    // Validación de fecha
    const reglaFecha = SpreadsheetApp.newDataValidation()
      .requireDate()
      .setAllowInvalid(false)
      .build();
    nuevaHoja.getRange("E4:E").setDataValidation(reglaFecha);

    SpreadsheetApp.flush();
    SpreadsheetApp.getUi().alert("✅ Hoja creada para el residente: " + nombreResidente);
  }

  //  2. CÁLCULO MANUAL DE LA FECHA PRÓXIMA A TRAER (COLUMNA G) 
  const esHojaDeResidente = nombreHoja !== hojaResidentes;
  if (esHojaDeResidente && [2, 4, 5].includes(col) && fila >= 4) {
    const filaActual = hoja.getRange(fila, 1, 1, 7).getValues()[0]; // columnas A-G
    const dosis = filaActual[1];          // Columna B
    const inventario = filaActual[3];     // Columna D
    const ultimaFecha = filaActual[4];    // Columna E

    const celdaFecha = hoja.getRange(fila, 7); // Columna G

    if (typeof dosis === 'number' && typeof inventario === 'number' && ultimaFecha instanceof Date) {
      const diasDuracion = inventario / dosis;
      const fechaProxima = new Date(ultimaFecha);
      fechaProxima.setDate(fechaProxima.getDate() + diasDuracion);
      celdaFecha.setValue(fechaProxima);
      celdaFecha.setNumberFormat("dd/mm/yyyy");
    } else {
      celdaFecha.clearContent();
    }
  }

  //  3. REGISTRAR QUIÉN EDITÓ (COLUMNA H) 
  if (esHojaDeResidente && fila >= 4 && col <= 7) {
    try {
      const correoUsuario = Session.getActiveUser().getEmail() || "Usuario desconocido";
      hoja.getRange(fila, 8).setValue(correoUsuario); // Columna H
    } catch (err) {
      hoja.getRange(fila, 8).setValue("Usuario desconocido");
    }
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🔍 Buscar residente")
    .addItem("Ir a hoja de residente...", "mostrarBuscadorDeHojas")
    .addToUi();
}

function mostrarBuscadorDeHojas() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt("Buscar hoja de residente", "Escribe el nombre del residente:", ui.ButtonSet.OK_CANCEL);

  if (response.getSelectedButton() === ui.Button.OK) {
    const nombreHoja = response.getResponseText().trim();
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombreHoja);

    if (hoja) {
      SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(hoja);
      ui.alert("✅ Has sido dirigido a la hoja del residente: " + nombreHoja);
    } else {
      ui.alert("❌ No se encontró ninguna hoja con el nombre: " + nombreHoja);
    }
  }
}