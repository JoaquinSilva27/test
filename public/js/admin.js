// public/js/admin.js


// Simulación de las tablas y sus atributos
const tableSchemas = {
  clientes: [
      { name: 'rut', type: 'text', placeholder: 'rut' },
      { name: 'nombre', type: 'text', placeholder: 'Nombre del cliente' },
      { name: 'apellido1', type: 'text', placeholder: 'apellido del cliente' },
      { name: 'apellido1', type: 'text', placeholder: 'apellido2 del cliente' },
      { name: 'cod_region', type: 'number', placeholder: 'cod_region' },
      { name: 'correo', type: 'text', placeholder: 'correo del cliente' },
      { name: 'telefono', type: 'number', placeholder: 'telefono del cliente' },
      { name: 'cod_cuota', type: 'number', placeholder: 'cod_cuota del cliente' },
      { name: 'cod_predio', type: 'number', placeholder: 'cod_predio' }
  ],
  terrenos: [
      { name: 'ubicacion', type: 'text', placeholder: 'Ubicación' },
      { name: 'tamano', type: 'number', placeholder: 'Tamaño en hectáreas' },
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
}

function showMsj() {
  document.querySelector('.mensaje-inicio').style.display = 'block';
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
}

// Función para manejar la selección de acción y llenar el Select
function selectAction(action) {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = ''; // Limpia el contenido previo
  formContainer.innerHTML = `
      <h3>${action.charAt(0).toUpperCase() + action.slice(1)} Registro</h3>
      <select id="tableSelect"">
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

  // Actualizar el título del segundo formulario según la selección
  document.getElementById('second-form-title').textContent = `${action} ${selectedTable}`;

  // Limpiar cualquier campo previo y añadir campos basados en la selección
  const fieldsContainer = document.getElementById('fields-container');
  fieldsContainer.innerHTML = ''; // Limpiar contenido previo

  // Obtener los campos del esquema de la tabla seleccionada
  const fields = tableSchemas[selectedTable] || [];
  
  // Crear elementos de entrada para cada campo
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
    // fecha
    if (input.type == 'date'){
      label.textContent = '';
    }

    
  });

  document.getElementById('second-section').style.display = 'block';
  document.getElementById('admin-registros-container').style.display = 'none';
}

// Función para enviar el formulario final
function submitFinalForm() {
  const selectedTable = document.getElementById('tableSelect').value;
  const fields = tableSchemas[selectedTable] || [];
  const formData = {};

  // Recolecta los valores ingresados en el formulario
  fields.forEach(field => {
      const input = document.querySelector(`#fields-container input[name="${field.name}"]`);
      formData[field.name] = input ? input.value : null;
  });

  // Muestra los datos recopilados (simula el envío)
  alert(`Datos enviados para la tabla ${selectedTable}:\n${JSON.stringify(formData, null, 2)}`);
}