// public/js/admin.js
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert(data.message);
        // Redirigir al usuario a la página de inicio de sesión después del logout
        window.location.href = "/login.html";
      } else {
        alert("Hubo un problema al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
      alert("Hubo un problema al cerrar sesión.");
    }
  });


// Muestra el contenedor de Administración de Registros
function showAdminRegistros() {
  document.querySelector('.mensaje-inicio').style.display = 'none';
  document.getElementById('admin-registros-container').style.display = 'block';
}

function showMsj() {
  document.querySelector('.mensaje-inicio').style.display = 'block';
  document.getElementById('admin-registros-container').style.display = 'None';
}



// Función para manejar la selección de acción y llenar el Select
function selectAction(action) {
  const formContainer = document.getElementById('form-container');
  formContainer.innerHTML = ''; // Limpia el contenido previo

  formContainer.innerHTML = `
      <h3>${action.charAt(0).toUpperCase() + action.slice(1)} Registro</h3>
      <select id="tableSelect" style="width: 100%; padding: 10px; margin-bottom: 20px;">
          <option value="clientes">Clientes</option>
          <option value="terrenos">Terrenos</option>
          <option value="pagos">Pagos</option>
          <option value="productos">Productos</option>
      </select>
      <button class="btn-guardar" onclick="submitForm('${action}')">Siguiente</button>
  `;
}

// Función para buscar tablas en tiempo real
function searchTables() {
  const selectBox = document.getElementById('tableSelect');
  selectBox.innerHTML = ''; // Limpia las opciones previas

  const tables = ['clientes', 'terrenos', 'pagos', 'productos']; // Datos de ejemplo
  const inputValue = ''; // Puedes dejar vacío ya que no hay un campo de entrada aquí

  // Filtra las tablas si es necesario, o muestra todas las opciones disponibles
  const filteredTables = tables; // Puedes aplicar un filtro si decides añadir un campo de texto más tarde

  // Añadir opciones al select box
  filteredTables.forEach(table => {
    const option = document.createElement('option');
    option.value = table;
    option.textContent = table;
    selectBox.appendChild(option);
  });
}


// Función para seleccionar la tabla y continuar con el formulario
function selectTable(tableName) {
  document.getElementById('tableName').value = tableName;
  document.getElementById('suggestions').innerHTML = ''; // Limpia las sugerencias
  // Aquí puedes añadir lógica para cargar dinámicamente los campos de la tabla seleccionada
}

function submitForm(action) {
  const selectBox = document.getElementById('tableSelect');
  const selectedOptions = Array.from(selectBox.selectedOptions).map(option => option.value);
  alert(`Formulario enviado para la acción: ${action} con selección: ${selectedOptions.join(', ')}`);
}
