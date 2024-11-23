function mostrarOpcionesReporte() {
    const reporteSeleccionado = document.getElementById("reporte-select").value;
    const opcionesReporte = document.getElementById("opciones-reporte");
    opcionesReporte.innerHTML = ""; // Limpia las opciones anteriores

    if (reporteSeleccionado === "ingresos-por-fecha") {
        opcionesReporte.innerHTML = `
        <div class="campo-dinamico">
            <label for="fecha-inicio">Fecha Inicio:</label>
            <input type="date" id="fecha-inicio">
        </div>
        <div class="campo-dinamico">
            <label for="fecha-fin">Fecha Fin:</label>
            <input type="date" id="fecha-fin">
        </div>
        `;
    }
}

async function generarReporte() {
    const reporteSeleccionado = document.getElementById("reporte-select").value;

    if (!reporteSeleccionado) {
        alert("Por favor, seleccione un tipo de reporte.");
        return;
    }

    try {
        console.log(`Generando reporte para: ${reporteSeleccionado}`);
        let response;

        if (reporteSeleccionado === "deudas-por-canal") {
            console.log("Enviando solicitud al endpoint deudas-por-canal...");
            response = await fetch("/api/reportes/deuda-canal");
        } else {
            alert("Esta opción aún no está implementada.");
            return;
        }

        console.log("Respuesta recibida:", response);

        if (!response || !response.ok) {
            throw new Error(`Error en el servidor: ${response?.statusText || "Sin respuesta"}`);
        }

        const data = await response.json();
        console.log("Datos del reporte recibidos:", data);
        mostrarResultadosReporte(reporteSeleccionado, data);
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        alert("Ocurrió un error al generar el reporte. Por favor, intente nuevamente.");
    }
}

function mostrarResultadosReporte(reporteSeleccionado, data) {
    console.log("Datos recibidos en mostrarResultadosReporte:", data); // Verifica los datos

    const tituloReporte = document.getElementById("reporte-titulo");
    const contenidoReporte = document.getElementById("reporte-detalle-contenido");

    document.getElementById("reportes-section").style.display = "none";
    document.getElementById("reporte-detalle-container").style.display = "block";
    console.log("reporte seleccionado: ",reporteSeleccionado);
    if (reporteSeleccionado === "deudas-por-canal") {
        tituloReporte.textContent = "Informe de Deuda por Canal";

        // Validar si data es un array y no está vacío
        if (!Array.isArray(data)) {
            console.error("Error: el dato recibido no es un array. Tipo recibido:", typeof data);
            contenidoReporte.innerHTML = "<p>Error: los datos no son válidos (no es un array).</p>";
            return;
        }
        if (data.length === 0) {
            console.warn("Advertencia: el array está vacío.");
            contenidoReporte.innerHTML = "<p>No se encontraron datos para mostrar.</p>";
            return;
        }

        console.log("Comenzando a procesar los elementos del array...");

        // Crear la tabla
        const tabla = document.createElement("table");
        tabla.className = "tabla-reporte";

        // Crear el encabezado de la tabla
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Nombre del Canal</th>
                <th>Total Deuda</th>
            </tr>
        `;
        tabla.appendChild(thead);

        // Crear el cuerpo de la tabla
        const tbody = document.createElement("tbody");
        let totalDeuda = 0;

        data.forEach((item, index) => {
            console.log(`Procesando item ${index}:`, item); // Log para depurar cada elemento

            if (!item || !item.NOMBRE_CANAL || typeof item.TOTAL_DEUDA !== "number") {
                console.error(`Error en el elemento ${index}:`, item);
                return; // Saltar a la siguiente iteración si el item no es válido
            }

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${item.NOMBRE_CANAL}</td>
                <td>$${item.TOTAL_DEUDA.toLocaleString("es-CL")}</td>
            `;
            tbody.appendChild(fila);
            totalDeuda += item.TOTAL_DEUDA; // Sumar la deuda total
        });

        console.log("Total de deuda calculado:", totalDeuda);

        tabla.appendChild(tbody);

        // Crear el pie de tabla para mostrar el total
        const tfoot = document.createElement("tfoot");
        tfoot.innerHTML = `
            <tr>
                <td>Total</td>
                <td>$${totalDeuda.toLocaleString("es-CL")}</td>
            </tr>
        `;
        tabla.appendChild(tfoot);

        // Limpiar contenido previo y agregar la tabla
        contenidoReporte.innerHTML = "";
        contenidoReporte.appendChild(tabla);
    }
}

function volverASeleccion() {
    document.getElementById("reportes-section").style.display = "block";
    document.getElementById("reporte-detalle-container").style.display = "none";
    const contenidoReporte = document.getElementById("reporte-detalle-contenido");
    contenidoReporte.innerHTML = ""; // Limpia el contenido previo
}
