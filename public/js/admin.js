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

// Muestra el contenedor de Administración de Registros
function showAdminRegistros() {
  document.querySelector('.mensaje-inicio').style.display = 'none';
  document.getElementById('admin-registros-container').style.display = 'block';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('eliminar-section').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'none';
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
}

// Función para manejar la selección de acción y llenar el Select
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

// Función para mostrar el segundo formulario en la segunda sección y desplazarse hacia él
function showNextForm(action) {
  const secondSection = document.getElementById('second-section');
  const selectedTable = document.getElementById('tableSelect').value;

  // Limpiar cualquier campo previo
  const fieldsContainer = document.getElementById('fields-container');
  fieldsContainer.innerHTML = '';

  if (action === "Agregar") {
    document.getElementById('second-form-title').textContent = `Agregar ${selectedTable}`;
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

    secondSection.style.display = 'block';
    document.getElementById('admin-registros-container').style.display = 'none';
    document.getElementById('consultar-section').style.display = 'none';
    document.getElementById('modificar-section').style.display = 'none';
    document.getElementById('eliminar-section').style.display = 'none';
    document.getElementById('reportes-section').style.display = 'none';

    const submitButton = document.querySelector('.btn-guardar');
    submitButton.textContent = 'Enviar';
    submitButton.onclick = agregarEntidad;

  } else if (action === "Consultar") {
    mostrarFormularioConsulta(selectedTable); 
  } else if (action === "Modificar") {
    document.getElementById('second-form-title').textContent = `Modificar ${selectedTable}`;
    mostrarFormularioModificar(selectedTable);
  } else if (action === "Eliminar") {
    document.getElementById('second-form-title').textContent = `Eliminar ${selectedTable}`;
    mostrarFormularioEliminar(selectedTable);
  }
}

// Función para agregar entidad
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

// Función para consultar entidad
function consultarEntidad() {
  const consultaInput = document.getElementById('consulta-input').value;
  const selectedTable = document.getElementById('tableSelect') ? document.getElementById('tableSelect').value : "Entidad";
  if (consultaInput == "") {
    alert("Por favor, ingrese un valor para realizar la consulta.");
    return; // Detiene la ejecución si el campo está vacío
  };
  // aca va el procedimiento almacenado
  const datosEntidad = {
    campo1: "Valor del Campo 1",
    campo2: "Valor del Campo 2",
    campo3: "Valor del Campo 3",
    campo4: "Valor del Campo 4"
  };

  document.querySelector('.resultado-consulta h3').textContent = `Datos de ${consultaInput}`;
  const camposResultado = document.querySelector('.campos-resultado');
  camposResultado.innerHTML = '';

  for (const [key, value] of Object.entries(datosEntidad)) {
    const campo = document.createElement('div');
    campo.className = 'campo';

    const label = document.createElement('label');
    label.textContent = key;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.disabled = true;
    

    campo.appendChild(label);
    campo.appendChild(input);
    camposResultado.appendChild(campo);
  }
}


function mostrarFormularioConsulta(selectedTable) {
  // Actualizar el título de la consulta para que muestre el nombre de la entidad seleccionada
  document.querySelector('.consultar-busqueda h3').textContent = `Consultar ${selectedTable}`;

  // Limpiar y configurar el contenedor de resultados
  document.querySelector('.resultado-consulta h3').textContent = `Datos de ${selectedTable}`;
  const camposResultado = document.querySelector('.campos-resultado');
  camposResultado.innerHTML = ''; // Limpia el contenido previo

  // Crear un campo de entrada para el criterio de búsqueda
  const consultaInput = document.getElementById('consulta-input');
  consultaInput.placeholder = `Ingrese ${selectedTable} (por RUT, nombre, etc.)`;

  // Mostrar la sección de consulta y ocultar las otras
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'block';
  document.getElementById('contenedor').style.display = 'none';

  // Simulación de datos para la consulta según los campos de `tableSchemas`
  const fields = tableSchemas[selectedTable] || [];
  fields.forEach(field => {
    const campo = document.createElement('div');
    campo.className = 'campo';

    const label = document.createElement('label');
    label.textContent = field.name;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = `Valor de ${field.name}`; // Aquí podrías poner datos de consulta reales
    input.disabled = true;

    campo.appendChild(label);
    campo.appendChild(input);
    camposResultado.appendChild(campo);
  });
}


function mostrarFormularioModificar(selectedTable) {
  // Actualizar el título para reflejar la entidad seleccionada
  document.querySelector('.modificar-busqueda h3').textContent = `Modificar ${selectedTable}`;

  // Limpiar cualquier contenido previo en la sección de modificación
  const camposResultado = document.querySelector('.campos-modificar');
  camposResultado.innerHTML = '';

  // Simulación de datos obtenidos para modificar
  const datosEntidad = {
    campo1: "Valor actual del Campo 1",
    campo2: "Valor actual del Campo 2",
    campo3: "Valor actual del Campo 3",
    campo4: "Valor actual del Campo 4"
  };

  // Crear campos editables para cada atributo de la entidad
  for (const [key, value] of Object.entries(datosEntidad)) {
    const campo = document.createElement('div');
    campo.className = 'campo';

    const label = document.createElement('label');
    label.textContent = key;

    const input = document.createElement('input');
    input.type = 'text';
    input.name = key; // Importante para identificar los campos al guardar
    input.value = value; // Mostrar el valor actual de cada campo
    input.required = true; // Marcar como obligatorio

    campo.appendChild(label);
    campo.appendChild(input);
    camposResultado.appendChild(campo);
  }

  // Mostrar la sección de modificar y ocultar las otras
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'block';
  document.getElementById('contenedor').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'none';
}

function guardarModificaciones() {
  // Recolectar los valores de los campos editados
  const campos = document.querySelectorAll('.campos-modificar input');
  const updatedData = {};

  campos.forEach(campo => {
    updatedData[campo.name] = campo.value;
  });

  // Simulación de actualización (aquí podrías hacer una solicitud al servidor)
  alert(`Datos actualizados:\n${JSON.stringify(updatedData, null, 2)}`);

  // Redirigir al contenedor principal CRUD después de guardar
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('admin-registros-container').style.display = 'block';
}

function buscarParaModificar() {
  const modificarInput = document.getElementById('modificar-input').value;
  const selectedTable = document.getElementById('tableSelect') ? document.getElementById('tableSelect').value : "Entidad";

  if (modificarInput === "") {
    alert("Por favor, ingrese un criterio de búsqueda.");
    return;
  }

  // Simulación de datos obtenidos
  const datosEntidad = {
    campo1: "Valor actual del Campo 1",
    campo2: "Valor actual del Campo 2",
    campo3: "Valor actual del Campo 3",
    campo4: "Valor actual del Campo 4"
  };

  // Mostrar los datos en campos editables
  const camposModificar = document.querySelector('.campos-modificar');
  camposModificar.innerHTML = '';
  for (const [key, value] of Object.entries(datosEntidad)) {
    const campo = document.createElement('div');
    campo.className = 'campo';

    const label = document.createElement('label');
    label.textContent = key;

    const input = document.createElement('input');
    input.type = 'text';
    input.name = key;
    input.value = value;

    campo.appendChild(label);
    campo.appendChild(input);
    camposModificar.appendChild(campo);
  }
}

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

function showReportes() {
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('contenedor').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'block';
}

function mostrarOpcionesReporte() {
  const selectedReporte = document.getElementById('reporte-select').value;
  const opcionesContainer = document.getElementById('opciones-reporte');
  opcionesContainer.innerHTML = ''; // Limpiar opciones previas
  

  if (selectedReporte === 'ingresos-por-fecha') {
    opcionesContainer.innerHTML = `
      <h3>Seleccione el Rango de Fechas</h3>
      <input type="date" id="fecha-inicio" placeholder="Fecha de Inicio">
      <input type="date" id="fecha-fin" placeholder="Fecha de Fin">
    `;
  } else if (selectedReporte === 'deudas-por-canal' || selectedReporte === 'regantes-por-canal') {
    opcionesContainer.innerHTML = `
      <h3>Seleccione el Canal</h3>
      <input type="text" id="canal-input" placeholder="Nombre del Canal">
    `;
  } else {
    opcionesContainer.innerHTML = ``;
  }
}

function generarReporte() {
  const selectedReporte = document.getElementById('reporte-select').value;
  const opcionesContainer = document.getElementById('reporte-opciones-container');
  const detalleContainer = document.getElementById('reporte-detalle-container');
  const resultadosContainer = document.getElementById('reporte-resultados');
  const reporteTitulo = document.getElementById('reporte-titulo');

  // Ocultar el contenedor de opciones
  opcionesContainer.style.display = 'none';

  // Mostrar el contenedor de detalles
  detalleContainer.style.display = 'block';

  // Actualizar el título del reporte
  const titulosReportes = {
    'regantes-por-canal': 'Reporte: Regantes por Canal',
    'regantes-y-predios': 'Reporte: Regantes y sus Predios',
    'ingresos-por-fecha': 'Reporte: Informe de Ingresos',
    'proyectos-activos': 'Reporte: Proyectos Activos',
    'deudas-por-canal': 'Reporte: Deudas por Canal'
  };
  reporteTitulo.textContent = titulosReportes[selectedReporte] || 'Reporte';

  // Simulación de datos
  const datosSimulados = [
    { nombre: 'Regante 1', canal: 'Canal A' },
    { nombre: 'Regante 2', canal: 'Canal B' },
    { nombre: 'Regante 3', canal: 'Canal C' }
  ];

  // Generar resultados
  resultadosContainer.innerHTML = ''; // Limpiar resultados previos
  datosSimulados.forEach(item => {
    const div = document.createElement('div');
    div.className = 'reporte-item';
    div.textContent = `${item.nombre} - ${item.canal}`;
    resultadosContainer.appendChild(div);
  });
}

function volverAReporteOpciones() {
  document.getElementById('reporte-opciones-container').style.display = 'block';
  document.getElementById('reporte-detalle-container').style.display = 'none';
}