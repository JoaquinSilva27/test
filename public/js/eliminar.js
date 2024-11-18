function mostrarFormularioEliminar(selectedTable) {
    // Actualizar el título con la entidad seleccionada
    document.querySelector('#eliminar-section h3').textContent = `Eliminar ${selectedTable}`;
  
    // Limpiar el campo de entrada por si hay valores previos
    document.getElementById('eliminar-input').value = '';
  
    // Mostrar la sección de eliminar y ocultar las demás
    document.getElementById('admin-registros-container').style.display = 'none';
    document.getElementById('second-section').style.display = 'none';
    document.getElementById('consultar-section').style.display = 'none';
    document.getElementById('modificar-section').style.display = 'none';
    document.getElementById('eliminar-section').style.display = 'block';
    document.getElementById('contenedor').style.display = 'none';
  }
  
function confirmarEliminar() {
const eliminarInput = document.getElementById('eliminar-input').value;
const selectedTable = document.getElementById('tableSelect').value;

// Validar que se haya ingresado un valor
if (!eliminarInput) {
    alert("Por favor, ingrese un valor para eliminar.");
    return;
}

// Mostrar confirmación
const confirmar = confirm(`¿Está seguro de que desea eliminar el registro con clave "${eliminarInput}" de la tabla ${selectedTable}?`);

if (confirmar) {
    // Simulación de eliminación (aquí iría la lógica real para interactuar con el servidor)
    alert(`Registro con clave "${eliminarInput}" eliminado de la tabla ${selectedTable}.`);

    // Redirigir al contenedor principal CRUD
    document.getElementById('eliminar-section').style.display = 'none';
    document.getElementById('admin-registros-container').style.display = 'block';
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