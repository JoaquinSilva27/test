function mostrarOpcionesReporte() {
    const reporteSeleccionado = document.getElementById("reporte-select").value;
    const opcionesReporte = document.getElementById("opciones-reporte");
    opcionesReporte.innerHTML = ""; // Limpia las opciones anteriores

    if (reporteSeleccionado === "regantes-por-canal") {
        opcionesReporte.innerHTML = `
        <div class="campo-dinamico" style="position: relative;">
            <label for="canal">Nombre del Canal:</label>
            <input type="text" id="canal" placeholder="Ingrese el canal">
            <ul id="sugerencias-canal" class="sugerencias"></ul>
        </div>
        `;
        const canales = ["Norte alto", "Norte bajo", "Nopal", "Nopal si", "Nutral", "Navi Alto"];
        configurarAutocompletado("canal", "sugerencias-canal", canales);
    } else if (reporteSeleccionado === "regantes-y-predios") {
        opcionesReporte.innerHTML = `
        <div class="campo-dinamico" style="position: relative;">
            <label for="regante">Nombre del Regante:</label>
            <input type="text" id="regante" placeholder="Ingrese el regante">
            <ul id="sugerencias-regante" class="sugerencias"></ul>
        </div>
        `;
        const regantes = ["Gabriel Bascuñán", "Guillermo Pérez", "Gonzalo López"];
        configurarAutocompletado("regante", "sugerencias-regante", regantes);
    } else if (reporteSeleccionado === "ingresos-por-fecha") {
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

function generarReporte() {
const reporteSeleccionado = document.getElementById("reporte-select").value;

if (!reporteSeleccionado) {
    alert("Por favor, seleccione un tipo de reporte.");
    return;
}

// Muestra el contenedor del reporte generado
document.getElementById("reportes-section").style.display = "none";
document.getElementById("reporte-detalle-container").style.display = "block";

const tituloReporte = document.getElementById("reporte-titulo");
tituloReporte.textContent = `Reporte: ${reporteSeleccionado}`;

const contenidoReporte = document.getElementById("reporte-detalle-contenido");
contenidoReporte.innerHTML = ""; // Limpia el contenido previo

// Genera contenido dinámico de ejemplo
for (let i = 1; i <= 10; i++) {
    const reporteItem = document.createElement("div");
    reporteItem.className = "reporte-item";
    reporteItem.textContent = `${reporteSeleccionado} - Registro ${i}`;
    contenidoReporte.appendChild(reporteItem);
}
}

function volverASeleccion() {
// Regresa al contenedor de selección
document.getElementById("reportes-section").style.display = "block";
document.getElementById("reporte-detalle-container").style.display = "none";
}

function configurarAutocompletado(inputId, sugerenciasId, datos) {
    const inputElemento = document.getElementById(inputId);
    const sugerenciasContainer = document.getElementById(sugerenciasId);

    if (!inputElemento || !sugerenciasContainer) {
        console.error(`Los elementos con IDs ${inputId} y/o ${sugerenciasId} no existen en el DOM.`);
        return;
    }

    // Escucha el evento de entrada en el campo de búsqueda
    inputElemento.addEventListener("input", (e) => {
        const valorBusqueda = e.target.value.toLowerCase();

        // Limpia las sugerencias anteriores
        sugerenciasContainer.innerHTML = "";

        if (valorBusqueda) {
            // Filtra los datos que coincidan con la búsqueda
            const resultados = datos.filter((item) =>
                item.toLowerCase().startsWith(valorBusqueda)
            );

            // Agrega los resultados como elementos de la lista
            resultados.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = item;

                // Al hacer clic en un resultado, completa el input
                li.addEventListener("click", () => {
                    inputElemento.value = item;
                    sugerenciasContainer.innerHTML = ""; // Limpia las sugerencias
                });

                sugerenciasContainer.appendChild(li);
            });
        }
    });

    // Limpia las sugerencias si el input pierde el foco
    inputElemento.addEventListener("blur", () => {
        setTimeout(() => (sugerenciasContainer.innerHTML = ""), 200); // Breve delay para permitir clics
    });
}


document.getElementById('reporte-select').addEventListener('change', () => {
if (document.getElementById('reporte-select').value === 'regantes-y-predios') {
    configurarBusquedaRegante();
}
});