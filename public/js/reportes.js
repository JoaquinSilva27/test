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
    } else if (reporteSeleccionado === "proyectos-activos-terminados") {
        opcionesReporte.innerHTML = `
        <div class="campo-dinamico">
            <label for="estado-proyecto">Filtrar por Estado:</label>
            <select id="estado-proyecto">
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="terminados">Terminados</option>
            </select>
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
        let response, data;

        if (reporteSeleccionado === "deudas-por-canal") {
            response = await fetch("/api/reportes/deuda-canal");
        } else if (reporteSeleccionado === "proyectos-activos-terminados") {
            response = await fetch("/api/reportes/proyectos");
        } else if (reporteSeleccionado === "ingresos-por-fecha") {
            // Obtener las fechas seleccionadas
            const fechaInicio = document.getElementById("fecha-inicio").value;
            const fechaFin = document.getElementById("fecha-fin").value;

            if (!fechaInicio || !fechaFin) {
                alert("Por favor, seleccione ambas fechas.");
                return;
            }

            console.log(`Fechas convertidas: inicio=${convertirFechaDDMMYY(fechaInicio)}, fin=${convertirFechaDDMMYY(fechaFin)}`);

            response = await fetch(`/api/reportes/ingresos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        } else {
            alert("Esta opción aún no está implementada.");
            return;
        }

        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.statusText}`);
        }

        data = await response.json();
        mostrarResultadosReporte(reporteSeleccionado, data);
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        alert("Ocurrió un error al generar el reporte. Por favor, intente nuevamente.");
    }
}

// Función para convertir fechas al formato DD-MM-YY
function convertirFechaDDMMYY(fechaISO) {
    const [year, month, day] = fechaISO.split("-");
    return `${day}-${month}-${year.slice(-2)}`; // DD-MM-YY
}

function mostrarResultadosReporte(reporteSeleccionado, data) {
    const tituloReporte = document.getElementById("reporte-titulo");
    const contenidoReporte = document.getElementById("reporte-detalle-contenido");
    const contenedor = document.getElementById("reporte-detalle-container");

    // Limpiar clases previas del contenedor
    contenedor.classList.remove("reporte-ingresos", "reporte-deudas", "reporte-proyectos");

    document.getElementById("reportes-section").style.display = "none";
    document.getElementById("reporte-detalle-container").style.display = "block";

    if (reporteSeleccionado === "deudas-por-canal") {
        tituloReporte.textContent = "Informe de Deuda por Canal";
        mostrarDeudasPorCanal(data, contenidoReporte);
        contenedor.classList.add("reporte-deudas"); // Clase específica
    } else if (reporteSeleccionado === "proyectos-activos-terminados") {
        tituloReporte.textContent = "Proyectos Activos/Terminados";
        mostrarProyectos(data, contenidoReporte);
        contenedor.classList.add("reporte-proyectos"); // Clase específica
    } else if (reporteSeleccionado === "ingresos-por-fecha") {
        tituloReporte.textContent = "Informe de Ingresos por Fecha";
        mostrarIngresos(data, contenidoReporte);
        contenedor.classList.add("reporte-ingresos"); // Clase específica
    }
}

function mostrarDeudasPorCanal(data, contenedor) {
    if (!Array.isArray(data) || data.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron datos de deuda.</p>";
        return;
    }

    const tabla = document.createElement("table");
    tabla.className = "tabla-reporte";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Nombre del Canal</th>
            <th>Total Deuda</th>
        </tr>
    `;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    let totalDeuda = 0;

    data.forEach(item => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${item.NOMBRE_CANAL}</td>
            <td>$${item.TOTAL_DEUDA.toLocaleString("es-CL")}</td>
        `;
        tbody.appendChild(fila);
        totalDeuda += item.TOTAL_DEUDA;
    });

    tabla.appendChild(tbody);

    const tfoot = document.createElement("tfoot");
    tfoot.innerHTML = `
        <tr>
            <td>Total</td>
            <td>$${totalDeuda.toLocaleString("es-CL")}</td>
        </tr>
    `;
    tabla.appendChild(tfoot);

    contenedor.innerHTML = "";
    contenedor.appendChild(tabla);
}

function mostrarProyectos(data, contenedor) {
    console.log("Datos recibidos en mostrarProyectos:", data);
    const filtro = document.getElementById("estado-proyecto").value;
    console.log("Filtro seleccionado:", filtro);

    let proyectosAMostrar = [];
    if (filtro === "activos") {
        proyectosAMostrar = data.activos;
    } else if (filtro === "terminados") {
        proyectosAMostrar = data.terminados;
    } else {
        proyectosAMostrar = [...data.activos, ...data.terminados];
    }

    console.log("Proyectos a mostrar:", proyectosAMostrar);

    if (!Array.isArray(proyectosAMostrar) || proyectosAMostrar.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron proyectos.</p>";
        return;
    }

    const tabla = document.createElement("table");
    tabla.className = "tabla-reporte-proyectos";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Nombre del Proyecto</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Término</th>
            <th>Estado</th>
        </tr>
    `;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    proyectosAMostrar.forEach(proyecto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${proyecto.NOMBRE_PROYECTO}</td>
            <td>${proyecto.FECHA_INICIO_PROYECTO || "N/A"}</td>
            <td>${proyecto.FECHA_FIN_PROYECTO || "N/A"}</td>
            <td>${proyecto.ESTADO_PROYECTO}</td>
        `;
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    contenedor.innerHTML = "";
    contenedor.appendChild(tabla);
}

function mostrarIngresos(data, contenedor) {
    if (!Array.isArray(data) || data.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron ingresos en el rango seleccionado.</p>";
        return;
    }

    // Función para convertir fechas al formato DD-MM-YYYY
    const convertirFecha = (fechaISO) => {
        if (!fechaISO) return "N/A";
        const fecha = new Date(fechaISO);
        const day = String(fecha.getDate()).padStart(2, '0');
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const year = fecha.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Calcular el total de pagos
    const totalPagado = data.reduce((acc, ingreso) => acc + ingreso.PAGO, 0);

    const tabla = document.createElement("table");
    tabla.className = "tabla-reporte-ingresos";

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Fecha de Pago</th>
            <th>Nombre del Pagador</th>
            <th>Monto Pagado</th>
        </tr>
    `;
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach(ingreso => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${convertirFecha(ingreso.FECHA_PAGO)}</td>
            <td>${ingreso.NOMBRE_PAGADOR || "N/A"}</td>
            <td>${ingreso.PAGO.toLocaleString("es-CL") || "N/A"}</td>
        `;
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    const tfoot = document.createElement("tfoot");
    tfoot.innerHTML = `
        <tr>
            <td colspan="2" style="text-align: right;">Total:</td>
            <td>${totalPagado.toLocaleString("es-CL")}</td>
        </tr>
    `;
    tabla.appendChild(tfoot);

    contenedor.innerHTML = "";
    contenedor.appendChild(tabla);
}


function volverASeleccion() {
    document.getElementById("reportes-section").style.display = "block";
    document.getElementById("reporte-detalle-container").style.display = "none";
    const contenidoReporte = document.getElementById("reporte-detalle-contenido");
    contenidoReporte.innerHTML = ""; // Limpia el contenido previo
}