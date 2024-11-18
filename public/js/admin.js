// Selecciona todos los botones dentro de #admin-options
const buttons = document.querySelectorAll('#admin-options .btn');

// Agrega un evento de clic a cada botón
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Remueve la clase 'selected' de todos los botones
        buttons.forEach(btn => btn.classList.remove('selected'));
        
        // Agrega la clase 'selected' solo al botón que fue clicado
        button.classList.add('selected');
    });
});

// Simulación de las tablas y sus atributos
const tableSchemas = {
  clientes: [
      { name: 'rut', type: 'text', placeholder: 'rut' },
      { name: 'nombre', type: 'text', placeholder: 'Nombre del cliente' },
      { name: 'apellido1', type: 'text', placeholder: 'apellido del cliente' },
      { name: 'apellido2', type: 'text', placeholder: 'apellido2 del cliente' },
      { name: 'cod_region', type: 'number', placeholder: 'cod_region' },
      { name: 'correo', type: 'text', placeholder: 'correo del cliente' },
      { name: 'telefono', type: 'number', placeholder: 'telefono del cliente' },
      { name: 'cod_cuota', type: 'number', placeholder: 'cod_cuota del cliente' },
      { name: 'cod_predio', type: 'number', placeholder: 'cod_predio' }
  ],
  terrenos: [
      { name: 'ubicacion', type: 'text', placeholder: 'Ubicación' },
      { name: 'tamaño', type: 'number', placeholder: 'Tamaño en hectáreas' },
      { name: 'canal', type: 'text', placeholder: 'canal' }
  ],
  pagos: [
      { name: 'monto', type: 'number', placeholder: 'Monto del pago' },
      { name: 'fecha', type: 'date', placeholder: 'Fecha de pago' }
  ],
  productos: [
      { name: 'producto', type: 'text', placeholder: 'Nombre del producto' },
      { name: 'precio', type: 'number', placeholder: 'Precio del producto' }
  ]
};

// Funciones generales para mostrar/ocultar secciones del panel
function showAdminRegistros() {
  document.querySelector('.mensaje-inicio').style.display = 'none';
  document.getElementById('admin-registros-container').style.display = 'block';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('eliminar-section').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'none';
  document.getElementById('reporte-detalle-container').style.display = 'none';
}

function showMsj() {
  document.querySelector('.mensaje-inicio').style.display = 'block';
  document.getElementById('contenedor').style.display = 'block';
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('eliminar-section').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'none';
  document.getElementById('reporte-detalle-container').style.display = 'none';
}

// Manejo de selección de acciones (Agregar, Consultar, Modificar, Eliminar, Reportes)
function selectAction(action) {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = ''; // Limpia el contenido previo
  formContainer.innerHTML = `
      <h3>${action.charAt(0).toUpperCase() + action.slice(1)} Registro</h3>
      <select id="tableSelect">
          <option value="clientes">Clientes</option>
          <option value="terrenos">Terrenos</option>
          <option value="pagos">Pagos</option>
          <option value="productos">Productos</option>
      </select>
      <button class="btn-guardar" onclick="showNextForm('${action}')">Siguiente</button>
  `;
}

// Lógica para mostrar el siguiente paso según la acción seleccionada
function showNextForm(action) {
  const selectedTable = document.getElementById('tableSelect').value; // Obtén la tabla seleccionada

    if (!selectedTable) {
        alert('Por favor, seleccione una tabla antes de continuar.');
        return;
    }
  if (action === "Agregar") {
      mostrarFormularioAgregar(selectedTable); // Llamará a la función en agregar.js
  } else if (action === "Consultar") {
      mostrarFormularioConsulta(selectedTable); // Llamará a la función en consultar.js
  } else if (action === "Modificar") {
      prepararFormularioModificar(selectedTable); // Llamará a la función en modificar.js
  } else if (action === "Eliminar") {
      mostrarFormularioEliminar(selectedTable); // Llamará a la función en eliminar.js
  }
}

// Función para mostrar la sección de reportes
function showReportes() {
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('contenedor').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'block';
  document.getElementById('reporte-detalle-container').style.display = 'none';
}

function prepararFormularioModificar(selectedTable) {
  // Actualiza el encabezado de la sección para reflejar la tabla seleccionada
  const header = document.querySelector('.modificar-busqueda h3');
  header.textContent = `Modificar ${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}`;

  // Limpiar los valores previos del input y las sugerencias
  const modificarInput = document.getElementById('modificar-input');
  modificarInput.value = '';
  const sugerenciasContainer = document.getElementById('sugerencias-modificar');
  sugerenciasContainer.innerHTML = '';

  // Limpia los campos del formulario de modificación, en caso de que haya datos residuales
  const camposResultado = document.querySelector('.campos-modificar');
  camposResultado.innerHTML = '';

  // Asegúrate de que la sección de modificar esté visible
  ocultarOtrasSecciones();
  document.getElementById('modificar-section').style.display = 'block';

  // Configura la búsqueda reactiva para la tabla seleccionada
  configurarBusquedaModificar();
}