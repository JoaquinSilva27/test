function mostrarFormularioEliminar(selectedTable) {
    // Actualizar el título con la entidad seleccionada
    document.querySelector('#eliminar-section h3').textContent = `Eliminar ${selectedTable}`;

    // Limpiar el campo de entrada por si hay valores previos
    const eliminarInput = document.getElementById('eliminar-input');
    eliminarInput.value = '';


    // Crear dinámicamente el contenedor para las sugerencias si no existe
    let sugerenciasContainer = document.getElementById('sugerencias-eliminar');
    if (!sugerenciasContainer) {
        sugerenciasContainer = document.createElement('ul');
        sugerenciasContainer.id = 'sugerencias-eliminar';
        sugerenciasContainer.classList.add('sugerencias-consultas');
        eliminarInput.parentNode.appendChild(sugerenciasContainer);
    }
    
    // Configurar la búsqueda reactiva para sugerencias
    configurarBusquedaEliminar(selectedTable);

    // Mostrar la sección de eliminar y ocultar las demás
    ocultarOtrasSecciones();
    document.getElementById('eliminar-section').style.display = 'block';
}

function configurarBusquedaEliminar(selectedTable) {
    const eliminarInput = document.getElementById('eliminar-input');
    const sugerenciasContainer = document.getElementById('sugerencias-eliminar');

    // Elimina cualquier listener previo para evitar duplicados
    eliminarInput.removeEventListener('input', eliminarInput._eliminarListener);

    // Define el nuevo listener
    const eliminarListener = async () => {
        const query = eliminarInput.value.trim();

        if (query.length > 0) {
            try {
                const resultados = await buscarSugerenciasEliminar(query, selectedTable);
                mostrarSugerenciasEliminar(resultados, sugerenciasContainer, eliminarInput);
            } catch (error) {
                console.error("Error al buscar sugerencias para eliminar:", error);
            }
        } else {
            sugerenciasContainer.innerHTML = ""; // Limpia las sugerencias si el input está vacío
        }
    };

    // Asocia el listener al input y guárdalo para poder eliminarlo después
    eliminarInput._eliminarListener = eliminarListener;
    eliminarInput.addEventListener('input', eliminarListener);
}

async function buscarSugerenciasEliminar(query, table) {
    try {
        const url = `http://localhost:3000/api/tables/${table}/suggestions?query=${query}`;
        console.log("Llamando al endpoint para sugerencias de eliminar:", url);

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error al buscar sugerencias para eliminar: ${response.statusText}`);
            return [];
        }

        const resultados = await response.json();
        console.log("Sugerencias obtenidas para eliminar:", resultados);
        return resultados; // Devuelve las sugerencias
    } catch (error) {
        console.error("Error al buscar sugerencias para eliminar:", error);
        return [];
    }
}

function mostrarSugerenciasEliminar(resultados, contenedor, input) {
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

async function confirmarEliminar() {
    const eliminarInput = document.getElementById('eliminar-input').value.trim();
    const selectedTable = document.getElementById('entitySelect').value;

    if (!eliminarInput) {
        alert("Por favor, ingresa un valor para eliminar.");
        return;
    }

    const confirmar = confirm(`¿Estás seguro de eliminar el registro con clave "${eliminarInput}" de la tabla ${selectedTable}?`);

    if (confirmar) {
        try {
            const url = `http://localhost:3000/api/tables/${selectedTable}/${eliminarInput}`;
            console.log("Llamando al endpoint para eliminar:", url);

            const response = await fetch(url, { method: 'DELETE' });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || "No se pudo eliminar el registro.");
                return;
            }

            const result = await response.json();
            alert(result.message || "Registro eliminado con éxito.");

            // Redirigir al contenedor principal CRUD después de la eliminación
            document.getElementById('eliminar-section').style.display = 'none';
            document.getElementById('admin-registros-container').style.display = 'block';
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
            alert("Ocurrió un error al intentar eliminar el registro.");
        }
    }
}

function ocultarOtrasSecciones() {
    document.getElementById('admin-registros-container').style.display = 'none';
    document.getElementById('consultar-section').style.display = 'none';
    document.getElementById('modificar-section').style.display = 'none';
    document.getElementById('eliminar-section').style.display = 'none';
    document.getElementById('reportes-section').style.display = 'none';
    document.getElementById('contenedor').style.display = 'none';
}

// Configurar la búsqueda reactiva para eliminar al cargar el script
configurarBusquedaEliminar();
