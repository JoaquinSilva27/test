// Función para mostrar el formulario de "Agregar"
function mostrarFormularioAgregar(selectedTable) {
    const fieldsContainer = document.getElementById('fields-container');
    fieldsContainer.innerHTML = ''; // Limpia cualquier campo previo
  
    // Cambiar el título de la sección
    document.getElementById('second-form-title').textContent = `Agregar ${selectedTable}`;
  
    // Obtener los campos asociados a la tabla seleccionada
    const fields = tableSchemas[selectedTable] || [];
    fields.forEach(field => {
      const inputBox = document.createElement('div');
      inputBox.className = 'input-box';
  
      const input = document.createElement('input');
      input.type = field.type;
      input.name = field.name;
      input.required = true;
  
      const label = document.createElement('label');
      label.textContent = field.placeholder;
  
      inputBox.appendChild(input);
      inputBox.appendChild(label);
      fieldsContainer.appendChild(inputBox);
    });
  
    // Mostrar la sección de formulario
    document.getElementById('second-section').style.display = 'block';
    ocultarOtrasSecciones();
  }
  
  // Función para enviar los datos de la entidad
function agregarEntidad() {
const selectedTable = document.getElementById('tableSelect').value;
const fields = tableSchemas[selectedTable] || [];
const formData = {};

fields.forEach(field => {
    const input = document.querySelector(`#fields-container input[name="${field.name}"]`);
    formData[field.name] = input ? input.value : null;
});

alert(`Datos enviados para la tabla ${selectedTable}:\n${JSON.stringify(formData, null, 2)}`);

// Redirige al contenedor principal CRUD después de enviar
document.getElementById('second-section').style.display = 'none'; // Ocultar la sección de formulario
document.getElementById('admin-registros-container').style.display = 'block'; // Mostrar el contenedor CRUD
document.getElementById('contenedor').style.display = 'none';
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