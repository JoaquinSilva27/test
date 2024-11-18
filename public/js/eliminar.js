function mostrarFormularioEliminar(selectedTable) {
  // Actualizar el título con la entidad seleccionada
  document.querySelector('#eliminar-section h3').textContent = `Eliminar ${selectedTable}`;

  // Limpiar el campo de entrada por si hay valores previos
  const eliminarInput = document.getElementById('eliminar-input');
  eliminarInput.value = '';

  // Configurar la búsqueda reactiva
  configurarBusquedaEliminar(selectedTable);

  // Mostrar la sección de eliminar y ocultar las demás
  ocultarOtrasSecciones();
  document.getElementById('eliminar-section').style.display = 'block';
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
      // Simulación de eliminación (datos sintéticos)
      alert(`Registro con clave "${eliminarInput}" eliminado de la tabla ${selectedTable}.`);

      // Aquí puedes implementar la lógica real para la eliminación
      // Ejemplo:
      // fetch('/api/eliminar', {
      //     method: 'DELETE',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ table: selectedTable, key: eliminarInput })
      // })
      // .then(response => response.json())
      // .then(data => {
      //     console.log('Eliminación exitosa:', data);
      // })
      // .catch(error => {
      //     console.error('Error al eliminar:', error);
      // });

      // Redirigir al contenedor principal CRUD después de la eliminación
      document.getElementById('eliminar-section').style.display = 'none';
      document.getElementById('admin-registros-container').style.display = 'block';
  }
}

function configurarBusquedaEliminar(selectedTable) {
  const eliminarInput = document.getElementById('eliminar-input');
  const sugerenciasContainer = document.createElement('ul'); // Crear un contenedor para las sugerencias
  sugerenciasContainer.id = 'sugerencias-eliminar';
  sugerenciasContainer.classList.add('sugerencias-consultas');
  eliminarInput.parentNode.appendChild(sugerenciasContainer);

  eliminarInput.addEventListener('input', () => {
      const query = eliminarInput.value.trim();

      // Limpia las sugerencias anteriores
      sugerenciasContainer.innerHTML = '';

      if (query.length > 0) {
          // Obtener resultados simulados
          const resultados = buscarSugerencias(selectedTable, query);

          // Mostrar sugerencias
          resultados.forEach(resultado => {
              const li = document.createElement('li');
              li.textContent = `${resultado.nombre} (${resultado.rut})`;

              // Completa el input al hacer clic
              li.addEventListener('click', () => {
                  eliminarInput.value = resultado.rut; // Llena el input con la sugerencia seleccionada
                  sugerenciasContainer.innerHTML = ''; // Limpia las sugerencias
              });

              sugerenciasContainer.appendChild(li);
          });
      }
  });

  // Limpia las sugerencias si el input pierde el foco
  eliminarInput.addEventListener('blur', () => {
      setTimeout(() => (sugerenciasContainer.innerHTML = ''), 200); // Breve delay para permitir clics
  });
}

function buscarSugerencias(table, query) {
  // Datos simulados (puedes reemplazar esto por una consulta real a la base de datos)
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

  // Aquí puedes reemplazar esta lógica con una consulta al servidor
  // Ejemplo:
  // fetch(`/api/sugerencias?table=${table}&query=${query}`)
  //     .then(response => response.json())
  //     .then(data => return data);

  return registros.filter(registro =>
      registro.rut.toLowerCase().includes(query.toLowerCase()) ||
      registro.nombre.toLowerCase().includes(query.toLowerCase())
  );
}

function ocultarOtrasSecciones() {
  document.getElementById('admin-registros-container').style.display = 'none';
  document.getElementById('consultar-section').style.display = 'none';
  document.getElementById('modificar-section').style.display = 'none';
  document.getElementById('eliminar-section').style.display = 'none';
  document.getElementById('reportes-section').style.display = 'none';
  document.getElementById('contenedor').style.display = 'none';
}
