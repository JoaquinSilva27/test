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

let currentAction = null; // Variable global para guardar la acción seleccionada

async function fetchEntities() {
  try {
      const response = await fetch('/entities/getEntities');
      if (!response.ok) {
          throw new Error('Error al obtener las entidades.');
      }
      const entities = await response.json();
      populateEntitySelect(entities);
  } catch (error) {
      console.error('Error al cargar entidades:', error);
      alert('No se pudieron cargar las entidades desde la base de datos.');
  }
}

// Poblar el selector con las entidades obtenidas
function populateEntitySelect(entities) {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = '';

  const options = entities.map(entity =>
      `<option value="${entity}">${entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()}</option>`
  ).join('');

  formContainer.innerHTML = `
      <h3>Seleccione la tabla</h3>
      <select id="entitySelect">
          <option value="" disabled selected>Seleccione una entidad</option>
          ${options}
      </select>
      <button class="btn-guardar" onclick="proceedWithAction()">Siguiente</button>
  `;
}


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

function setAction(action) {
  currentAction = action;
  console.log(`Acción seleccionada: ${action}`);

  // Cambia el título según la acción seleccionada
  const titleElement = document.querySelector('#form-container h3');
  if (titleElement) {
      titleElement.textContent = `${action} entidad`;
  }

  // Cambia visualmente el botón seleccionado
  const buttons = document.querySelectorAll('#admin-options .btn');
  buttons.forEach(btn => btn.classList.remove('selected'));
  const clickedButton = Array.from(buttons).find(btn => btn.textContent === action);
  if (clickedButton) {
      clickedButton.classList.add('selected');
  }
}


// Manejar la acción seleccionada por el usuario
function proceedWithAction() {
  const selectedEntity = document.getElementById('entitySelect').value;

  if (!currentAction) {
      alert('Por favor, seleccione una acción antes de continuar.');
      return;
  }

  if (!selectedEntity) {
    alert('Por favor, selecciona una entidad antes de continuar.');
    return;
  }

  console.log(`Procediendo con la acción: ${currentAction} sobre la entidad: ${selectedEntity}`);

  if (currentAction  === "Agregar") {
      mostrarFormularioAgregar(selectedEntity);
  } else if (currentAction  === "Consultar") {
      mostrarFormularioConsulta(selectedEntity);
  } else if (currentAction  === "Modificar") {
      prepararFormularioModificar(selectedEntity);
  } else if (currentAction  === "Eliminar") {
      mostrarFormularioEliminar(selectedEntity);
  }
}

// Llamar a fetchEntities cuando se cargue la página
document.addEventListener('DOMContentLoaded', fetchEntities);


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