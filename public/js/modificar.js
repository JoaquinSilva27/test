function configurarBusquedaModificar() {
    const modificarInput = document.getElementById("modificar-input");
    const sugerenciasContainer = document.getElementById("sugerencias-modificar");

    // Elimina cualquier listener previo para evitar duplicados
    modificarInput.removeEventListener("input", modificarInput._modificarListener);

    // Define el nuevo listener
    const modificarListener = async () => {
        const query = modificarInput.value.trim();
        const selectedTable = document.getElementById("entitySelect").value;

        if (query.length > 0) {
            try {
                const resultados = await buscarSugerenciasModificar(query, selectedTable);
                mostrarSugerenciasModificar(resultados, sugerenciasContainer, modificarInput);
            } catch (error) {
                console.error("Error al buscar sugerencias:", error);
            }
        } else {
            sugerenciasContainer.innerHTML = ""; // Limpia las sugerencias si el input está vacío
        }
    };

    // Asocia el listener al input y guárdalo para poder eliminarlo después
    modificarInput._modificarListener = modificarListener;
    modificarInput.addEventListener("input", modificarListener);
}

async function buscarSugerenciasModificar(query, table) {
    try {
        const url = `http://localhost:3000/api/tables/${table}/suggestions?query=${query}`;
        console.log("Llamando al endpoint para sugerencias:", url);

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error al buscar sugerencias: ${response.statusText}`);
            return [];
        }

        const resultados = await response.json();
        console.log("Sugerencias obtenidas:", resultados);
        return resultados; // Devuelve las sugerencias
    } catch (error) {
        console.error("Error al buscar sugerencias:", error);
        return [];
    }
}

function mostrarSugerenciasModificar(resultados, contenedor, input) {
    contenedor.innerHTML = ""; // Limpia el contenedor de sugerencias anteriores

    resultados.forEach((resultado) => {
        const item = document.createElement("li");
        item.textContent = `${resultado.nombre} (${resultado.pk})`; // Muestra el nombre formateado
        item.addEventListener("click", () => {
            input.value = resultado.pk; // Llena el campo con la PK seleccionada
            contenedor.innerHTML = ""; // Limpia las sugerencias
        });
        contenedor.appendChild(item);
    });
}

async function buscarParaModificar() {
    const modificarInput = document.getElementById("modificar-input").value.trim();
    const selectedTable = document.getElementById("entitySelect").value;

    if (!modificarInput) {
        alert("Por favor, selecciona o ingresa un valor válido.");
        return;
    }

    try {
        // Llama al endpoint para obtener los datos del registro por su PK
        const url = `http://localhost:3000/api/tables/${selectedTable}/data/${modificarInput}`;
        console.log("Llamando al endpoint para obtener datos:", url);

        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            alert(error.error || "No se encontraron datos para el criterio proporcionado.");
            return;
        }

        const registroSeleccionado = await response.json();
        if (!registroSeleccionado || Object.keys(registroSeleccionado).length === 0) {
            alert("No se encontraron datos para la clave proporcionada.");
            return;
        }

        mostrarFormularioModificar(selectedTable, registroSeleccionado);
    } catch (error) {
        console.error("Error al buscar registro para modificar:", error);
        alert("Ocurrió un error al buscar el registro.");
    }
}

function mostrarFormularioModificar(selectedTable, registro) {
    const camposResultado = document.querySelector(".campos-modificar");
    camposResultado.innerHTML = "";

    registro.data.forEach(({ columnName, value, editable }) => {
        const campo = document.createElement("div");
        campo.className = "campo";

        const label = document.createElement("label");
        label.textContent = columnName; // Nombre de la columna

        const input = document.createElement("input");
        input.type = "text";
        input.name = columnName;
        input.value = value !== null ? value : ""; // Maneja valores nulos
        input.required = true;

        if (!editable) {
            input.disabled = true; // La PK no es editable
        }

        campo.appendChild(label);
        campo.appendChild(input);
        camposResultado.appendChild(campo);
    });

    ocultarOtrasSecciones();
    document.getElementById("modificar-section").style.display = "block";
}

async function guardarModificaciones() {
    const campos = document.querySelectorAll(".campos-modificar input");
    const updatedData = {};
    let pk = null; // Inicializa la clave primaria

    // Recolectar los valores de los campos editados
    campos.forEach((campo) => {
        if (campo.name.toLowerCase().includes("pk") || campo.disabled) {
            pk = campo.value; // Detecta la PK como un campo deshabilitado
        } else {
            updatedData[campo.name] = campo.value;
        }
    });

    if (!pk) {
        alert("No se puede actualizar el registro sin la clave primaria.");
        return;
    }

    const selectedTable = document.getElementById("entitySelect").value;

    try {
        const response = await fetch(`http://localhost:3000/api/tables/${selectedTable}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pk, ...updatedData }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || "Registro actualizado con éxito.");
            document.getElementById("modificar-section").style.display = "none";
            document.getElementById("admin-registros-container").style.display = "block";
        } else {
            alert(result.error || "Error al actualizar el registro.");
        }
    } catch (error) {
        console.error("Error al guardar modificaciones:", error);
        alert("Ocurrió un error al guardar las modificaciones.");
    }
}

function ocultarOtrasSecciones() {
    document.getElementById("admin-registros-container").style.display = "none";
    document.getElementById("consultar-section").style.display = "none";
    document.getElementById("modificar-section").style.display = "none";
    document.getElementById("eliminar-section").style.display = "none";
    document.getElementById("reportes-section").style.display = "none";
    document.getElementById("contenedor").style.display = "none";
    document.getElementById("reporte-detalle-container").style.display = "none";
}

// Configurar búsqueda reactiva al cargar el script
configurarBusquedaModificar();
