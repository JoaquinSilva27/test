function consultarEntidad() {
  const consultaInput = document.getElementById('consulta-input').value.trim();
  const selectedTable = document.getElementById('tableSelect').value; // Obtener la tabla seleccionada
  if (!consultaInput) {
      alert('Por favor, ingrese un valor para realizar la consulta.');
      return;
  }

  // Aquí llamas a tu backend o procedes con la consulta almacenada
  const datosEntidad = {
      campo1: "Valor del Campo 1",
      campo2: "Valor del Campo 2",
      campo3: "Valor del Campo 3",
      campo4: "Valor del Campo 4"
  };

  // Actualiza los resultados
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
  consultaInput.placeholder = `Ingrese ${selectedTable} (por PK, nombre, etc.)`;

  // Mostrar la sección de consulta y ocultar las otras
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('second-section').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'block';
  document.getElementById('contenedor').style.display = 'none';

  // Configura el autocompletado
  configurarBusquedaConsulta(selectedTable);
}

function configurarBusquedaConsulta(selectedTable) {
  const consultaInput = document.getElementById('consulta-input');
  const sugerenciasConsulta = document.getElementById('sugerencias-consulta');

  consultaInput.addEventListener('input', async () => {
      const query = consultaInput.value.trim();

      if (query.length > 0) {
          const resultados = await buscarConsulta(query, selectedTable); // Pasa la tabla seleccionada
          mostrarSugerenciasConsulta(resultados, sugerenciasConsulta, consultaInput);
      } else {
          sugerenciasConsulta.innerHTML = ''; // Limpia las sugerencias si el input está vacío
      }
  });
}

// Simula una función que busca en la base de datos
async function buscarConsulta(query, table) {
  // Simulación de datos para cada tabla (reemplazar con datos reales)
  const registrosMock = {
      clientes: [
          { rut: '12345678-9', nombre: 'Juan Pérez' },
          { rut: '98765432-1', nombre: 'María Gómez' },
          { rut: '12398765-4', nombre: 'Pedro González' }
      ],
      terrenos: [
          { rut: 'Terreno-001', nombre: 'Terreno Norte' },
          { rut: 'Terreno-002', nombre: 'Terreno Este' }
      ],
      pagos: [
          { rut: 'Pago-001', nombre: 'Pago Enero' },
          { rut: 'Pago-002', nombre: 'Pago Febrero' }
      ]
  };

  const registros = registrosMock[table] || [];
  return registros.filter(registro =>
      registro.rut.toLowerCase().includes(query.toLowerCase()) ||
      registro.nombre.toLowerCase().includes(query.toLowerCase())
  );
}

function mostrarSugerenciasConsulta(resultados, contenedor, input) {
  contenedor.innerHTML = ''; // Limpia el contenedor de sugerencias anteriores

  resultados.forEach(resultado => {
      const item = document.createElement('li');
      item.textContent = `${resultado.nombre} (${resultado.rut})`;
      item.addEventListener('click', () => {
          input.value = resultado.rut; // Llena el campo con el valor seleccionado
          contenedor.innerHTML = ''; // Limpia las sugerencias
      });
      contenedor.appendChild(item);
  });
}
