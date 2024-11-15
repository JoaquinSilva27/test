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
}

function showMsj() {
  document.querySelector('.mensaje-inicio').style.display = 'block';
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
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

    const submitButton = document.querySelector('.btn-guardar');
    submitButton.textContent = 'Enviar';
    submitButton.onclick = agregarEntidad;

  } else if (action === "Consultar") {
    mostrarFormularioConsulta(selectedTable); 
  } else if (action === "Modificar") {
    document.getElementById('second-form-title').textContent = `Modificar ${selectedTable}`;
    // Similar lógica para cargar el formulario de Modificar
    // ...

  } else if (action === "Eliminar") {
    document.getElementById('second-form-title').textContent = `Eliminar ${selectedTable}`;
    // Similar lógica para cargar el formulario de Eliminar
    // ...
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
}

// Función para consultar entidad
function consultarEntidad() {
  const consultaInput = document.getElementById('consulta-input').value;
  const selectedTable = document.getElementById('tableSelect') ? document.getElementById('tableSelect').value : "Entidad";
  if (consultaInput == "") {
    alert("Por favor, ingrese un valor para realizar la consulta.");
    return; // Detiene la ejecución si el campo está vacío
  }
  
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