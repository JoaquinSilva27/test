
  
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
    configurarAutocompletado(); // Configura el autocompletado para este campo
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
} else if (reporteSeleccionado === "regantes-y-predios") {
    opcionesReporte.innerHTML = `
    <div class="campo-dinamico" style="position: relative;">
        <label for="regante">Nombre del Regante:</label>
        <input type="text" id="regante" placeholder="Ingrese el regante">
        <ul id="sugerencias-regante" class="sugerencias"></ul>
    </div>
    `;
    configurarAutocompletado("regante"); // Configura el autocompletado para regantes
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

function configurarAutocompletado() {
const inputCanal = document.getElementById("canal");
const sugerenciasContainer = document.getElementById("sugerencias-canal");

// Datos simulados de canales (puedes reemplazar con una consulta al servidor)
const canales = [
    "Norte alto",
    "Norte bajo",
    "Nopal",
    "Nopal si",
    "Nutral",
    "Navi Alto"
];

// Escucha el evento de entrada en el campo de búsqueda
inputCanal.addEventListener("input", (e) => {
    const valorBusqueda = e.target.value.toLowerCase();

    // Limpia las sugerencias anteriores
    sugerenciasContainer.innerHTML = "";

    if (valorBusqueda) {
    // Filtra los canales que coincidan con la búsqueda
    const resultados = canales.filter((canal) =>
        canal.toLowerCase().startsWith(valorBusqueda)
    );

    // Agrega los resultados como elementos de la lista
    resultados.forEach((canal) => {
        const li = document.createElement("li");
        li.textContent = canal;

        // Al hacer clic en un resultado, completa el input
        li.addEventListener("click", () => {
        inputCanal.value = canal;
        sugerenciasContainer.innerHTML = ""; // Limpia las sugerencias
        });

        sugerenciasContainer.appendChild(li);
    });
    }
});

// Limpia las sugerencias si el input pierde el foco
inputCanal.addEventListener("blur", () => {
    setTimeout(() => (sugerenciasContainer.innerHTML = ""), 200); // Breve delay para permitir clics
});
}

document.getElementById('reporte-select').addEventListener('change', () => {
if (document.getElementById('reporte-select').value === 'regantes-y-predios') {
    configurarBusquedaRegante();
}
});

function configurarBusquedaRegante() {
const inputRegante = document.getElementById('regante');
const sugerenciasRegante = document.getElementById('sugerencias-regante');

inputRegante.addEventListener('input', async () => {
    const query = inputRegante.value.trim();

    if (query.length > 0) {
    const resultados = await buscarRegantes(query); // Simula o llama a tu backend aquí
    mostrarSugerencias(resultados, sugerenciasRegante, inputRegante);
    } else {
    sugerenciasRegante.innerHTML = ''; // Limpia las sugerencias si el input está vacío
    }
});
}

// Simula una función que busca regantes (puede reemplazarse por una llamada a tu backend)
async function buscarRegantes(query) {
const regantesMock = ['Gabriel Bascuñán', 'Guillermo Pérez', 'Gonzalo López'];
return regantesMock.filter(regante =>
    regante.toLowerCase().includes(query.toLowerCase())
);
}

function mostrarSugerencias(resultados, contenedor, input) {
contenedor.innerHTML = ''; // Limpia el contenedor de sugerencias anteriores

resultados.forEach(resultado => {
    const item = document.createElement('li');
    item.textContent = resultado;
    item.addEventListener('click', () => {
    input.value = resultado; // Llena el campo con el valor seleccionado
    contenedor.innerHTML = ''; // Limpia las sugerencias
    });
    contenedor.appendChild(item);
});
}