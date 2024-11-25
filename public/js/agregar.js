let SelectedTable1 = ''; // Variable global para almacenar la tabla seleccionada

// Función para mostrar el formulario de "Agregar"
async function mostrarFormularioAgregar(selectedTable) {
    SelectedTable1 = selectedTable;
    document.querySelector('.fixed-header h3').textContent = `Agregar ${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1).toLowerCase()}`;
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = ''; // Limpia cualquier campo previo

    // Define los atributos especiales y sus valores permitidos
    const atributosEspeciales = {
        ROL: ["user", "admin"], 
        PRIVILEGIOS: ["user", "admin"],
        ESTADO_PROYECTO: ["Activo", "Terminado"], 
        TIPO_CUOTA: ["Ordinaria", "Extraordinaria"], 
        // Agrega más atributos según sea necesario
    };

    try {
        console.log(`Obteniendo campos para la tabla: ${selectedTable}`);
        const response = await fetch(`http://localhost:3000/api/tables/columns/${selectedTable}`);
        if (!response.ok) {
            throw new Error('Error al obtener los campos de la tabla.');
        }

        const fields = await response.json();
        console.log('Campos obtenidos del backend:', fields);

        // Generar el formulario excluyendo PK, excepto si el nombre es RUT
        fields
            .filter(field => !field.isPrimaryKey || field.name === 'RUT_USUARIO') // Excluye la PK, pero permite RUT
            .forEach(field => {
                const inputBox = document.createElement('div');
                inputBox.className = 'input-box';

                const label = document.createElement('label');
                label.textContent = field.name;

                // Verifica si el campo es un atributo especial con opciones predefinidas
                if (atributosEspeciales[field.name]) {
                    const select = document.createElement('select');
                    select.name = field.name;
                    select.required = true;

                    // Agrega las opciones al select
                    const placeholderOption = document.createElement('option');
                    placeholderOption.value = '';
                    placeholderOption.textContent = '';
                    placeholderOption.disabled = true;
                    placeholderOption.selected = true;
                    select.appendChild(placeholderOption);

                    atributosEspeciales[field.name].forEach(opcion => {
                        const option = document.createElement('option');
                        option.value = opcion;
                        option.textContent = opcion;
                        select.appendChild(option);
                    });

                    inputBox.appendChild(select);
                } else {
                    const input = document.createElement('input');
                    input.type = field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text';
                    input.name = field.name;
                    input.required = true;
                    if (field.maxLength) {
                        input.maxLength = field.maxLength; 
                    }
                    // Agregar placeholder y validaciones específicas para campos de tipo date
                    if (field.type === 'date') {
                        input.placeholder = 'dd-mm-aaaa'; // Placeholder con formato de fecha
                        input.pattern = '\\d{4}-\\d{2}-\\d{2}'; // Patrón de validación para fechas
                    }

                    inputBox.appendChild(input);
                }

                inputBox.appendChild(label);
                fieldsContainer.appendChild(inputBox);
            });

        console.log('Formulario generado sin la PK (excepto si es RUT).');
        document.getElementById('second-section').style.display = 'block';
        ocultarOtrasSecciones();
    } catch (error) {
        console.error('Error al cargar el formulario:', error);
        alert('No se pudieron cargar los campos de la tabla seleccionada.');
    }
}

function convertirFormatoFecha(fechaISO) {
    const [year, month, day] = fechaISO.split('-');
    return `${day}-${month}-${year}`;
}

// Función para enviar los datos de la entidad a la base de datos
async function agregarEntidad() {
    const fieldsContainer = document.getElementById('fields-container');
    const inputs = fieldsContainer.querySelectorAll('input, select'); // Incluye inputs y selects

    console.log('Tabla seleccionada en el frontend:', SelectedTable1); // Log para depuración

    const formData = {};
    let hasEmptyFields = false; // Variable para rastrear si hay campos vacíos

    inputs.forEach(field => {
        let value = field.value;

        if (!value.trim()) { // Si el campo está vacío
            hasEmptyFields = true;
        }

        if (field.type === 'date') { 
            // Convertir formato de fecha si es un campo de tipo 'date'
            value = convertirFormatoFecha(value);
        }

        formData[field.name] = value; // Captura el valor de cada campo por su atributo "name"
    });

    if (hasEmptyFields) {
        alert('Por favor, completa todos los campos antes de enviar.');
        return; // Detiene la ejecución si hay campos vacíos
    }
    console.log('Datos recolectados:', formData); // Verifica qué datos estás enviando

    try {
        const response = await fetch(`http://localhost:3000/api/tables/${SelectedTable1}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData) // Convierte los datos a JSON
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Muestra el mensaje de éxito del servidor
        } else {
            alert(`Error: ${result.error}`); // Muestra el error devuelto por el servidor
        }
    } catch (error) {
        console.error("Error al agregar el registro:", error);
        alert('Ocurrió un error al intentar agregar el registro.');
    }
}

function ocultarOtrasSecciones() {
document.getElementById('admin-registros-container').style.display = 'none';
document.getElementById('consultar-section').style.display = 'none';
document.getElementById('modificar-section').style.display = 'none';
document.getElementById('eliminar-section').style.display = 'none';
document.getElementById('reportes-section').style.display = 'none';
document.getElementById('contenedor').style.display = 'none';
document.getElementById('reporte-detalle-container').style.display = 'none';
}