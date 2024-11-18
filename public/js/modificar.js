function configurarBusquedaModificar() {
  const modificarInput = document.getElementById("modificar-input");
  const sugerenciasContainer = document.getElementById("sugerencias-modificar");

  // Escucha el evento de entrada en el campo de búsqueda
  modificarInput.addEventListener("input", () => {
      const query = modificarInput.value.trim();
      const selectedTable = document.getElementById("tableSelect").value;

      // Limpia las sugerencias anteriores
      sugerenciasContainer.innerHTML = "";

      if (query.length > 0) {
          // Busca sugerencias basadas en el input
          const resultados = buscarSugerencias(selectedTable, query);

          // Muestra los resultados en la lista de sugerencias
          resultados.forEach((resultado) => {
              const li = document.createElement("li");
              li.textContent = `${resultado.nombre} (${resultado.rut})`;

              // Al hacer clic en un resultado, completa el input
              li.addEventListener("click", () => {
                  modificarInput.value = resultado.rut; // Llena el campo con el valor seleccionado
                  sugerenciasContainer.innerHTML = ""; // Limpia las sugerencias
              });

              sugerenciasContainer.appendChild(li);
          });
      }
  });

  // Limpia las sugerencias si el input pierde el foco
  modificarInput.addEventListener("blur", () => {
      setTimeout(() => (sugerenciasContainer.innerHTML = ""), 200); // Breve delay para permitir clics
  });
}

function buscarSugerencias(table, query) {
  const registrosMock = {
      clientes: [
          { rut: "12345678-9", nombre: "Juan Pérez" },
          { rut: "98765432-1", nombre: "María Gómez" },
          { rut: "12398765-4", nombre: "Pedro González" },
      ],
      terrenos: [
          { rut: "Terreno-001", nombre: "Terreno Norte" },
          { rut: "Terreno-002", nombre: "Terreno Este" },
      ],
      pagos: [
          { rut: "Pago-001", nombre: "Pago Enero" },
          { rut: "Pago-002", nombre: "Pago Febrero" },
      ],
  };

  const registros = registrosMock[table] || [];
  return registros.filter(
      (registro) =>
          registro.rut.toLowerCase().includes(query.toLowerCase()) ||
          registro.nombre.toLowerCase().includes(query.toLowerCase())
  );
}

function buscarParaModificar() {
  const modificarInput = document.getElementById("modificar-input").value.trim();
  const selectedTable = document.getElementById("tableSelect").value;

  // Validar que el input no esté vacío
  if (!modificarInput) {
      alert("Por favor, ingrese un criterio válido o seleccione una opción de la lista.");
      return;
  }

  // Verificar si el valor coincide con un registro válido
  const resultados = buscarSugerencias(selectedTable, modificarInput);

  if (resultados.length === 0) {
      alert("No se encontró ningún registro con el criterio proporcionado.");
      return;
  }

  // Si hay coincidencia, cargar el formulario con los datos seleccionados
  const registroSeleccionado = resultados[0]; // Considerando que el usuario ya seleccionó un valor válido
  mostrarFormularioModificar(selectedTable, registroSeleccionado); // Muestra el formulario con datos
}

function mostrarFormularioModificar(selectedTable, registroSeleccionado) {
  const camposResultado = document.querySelector(".campos-modificar");
  camposResultado.innerHTML = "";

  // Obtén los campos de la tabla seleccionada
  const fields = tableSchemas[selectedTable] || [];

  // Genera campos editables con los datos del registro seleccionado
  fields.forEach((field) => {
      const campo = document.createElement("div");
      campo.className = "campo";

      const label = document.createElement("label");
      label.textContent = field.placeholder;

      const input = document.createElement("input");
      input.type = field.type;
      input.name = field.name;
      input.value = registroSeleccionado[field.name] || ""; // Valor del registro
      input.required = true;

      campo.appendChild(label);
      campo.appendChild(input);
      camposResultado.appendChild(campo);
  });

  // Aplicar diseño de 2 columnas con scroll
  camposResultado.style.display = "grid";
  camposResultado.style.gridTemplateColumns = "repeat(2, 1fr)";
  camposResultado.style.gap = "15px";

  // Mostrar la sección de modificar
  ocultarOtrasSecciones();
  document.getElementById("modificar-section").style.display = "block";
}

function guardarModificaciones() {
  // Recolectar los valores de los campos editados
  const campos = document.querySelectorAll(".campos-modificar input");
  const updatedData = {};

  campos.forEach((campo) => {
      updatedData[campo.name] = campo.value;
  });

  // Simulación de actualización (aquí podrías hacer una solicitud al servidor)
  alert(`Datos actualizados:\n${JSON.stringify(updatedData, null, 2)}`);

  // Redirigir al contenedor principal CRUD después de guardar
  document.getElementById("modificar-section").style.display = "none";
  document.getElementById("admin-registros-container").style.display = "block";
}

function ocultarOtrasSecciones() {
  document.getElementById("admin-registros-container").style.display = "none";
  document.getElementById("consultar-section").style.display = "none";
  document.getElementById("modificar-section").style.display = "none";
  document.getElementById("eliminar-section").style.display = "none";
  document.getElementById("reportes-section").style.display = "none";
  document.getElementById("contenedor").style.display = "none";
  document.getElementById('reporte-detalle-container').style.display = 'none';
}

// Configurar búsqueda reactiva al cargar el script
configurarBusquedaModificar();
