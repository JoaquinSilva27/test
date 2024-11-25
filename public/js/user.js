function showMsj() {
    ocultarSecciones();
    document.getElementById('contenedor').style.display = 'block';
}

async function realizarPago() {
    const rut = await obtenerSesionUsuario().then(usuario => usuario.rut); // Obtener el RUT del usuario
    const cantidad = parseFloat(document.getElementById("amountInput").value);
    const paymentMessage = document.getElementById("paymentMessage");

    if (!cantidad || cantidad <= 0) {
        paymentMessage.innerText = "Por favor, ingrese una cantidad válida.";
        return;
    }

    try {
        const response = await fetch("/auth/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rut, cantidad })
        });

        const data = await response.json();

        if (data.success) {
            paymentMessage.style.color = "green";
            paymentMessage.innerText = data.message;

            // Actualizar la deuda restante en la interfaz
            const deudaActual = parseFloat(document.getElementById("debtAmount").innerText);
            const nuevaDeuda = deudaActual - cantidad;
            document.getElementById("debtAmount").innerText = nuevaDeuda >= 0 ? nuevaDeuda : 0;

            // Limpiar el campo de entrada
            document.getElementById("amountInput").value = "";
        } else {
            paymentMessage.style.color = "red";
            paymentMessage.innerText = data.message;
        }
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        paymentMessage.style.color = "red";
        paymentMessage.innerText = "Error al procesar el pago.";
    }
}


function ocultarSecciones() {
    // Oculta todas las secciones
    document.getElementById('contenedor').style.display = 'none';
    document.getElementById('pagar-contenedor').style.display = 'none';
    document.getElementById('perfil-contenedor').style.display = 'none';
    document.getElementById('mis-datos-contenedor').style.display = 'none';
    document.getElementById('historial-pagos-contenedor').style.display = 'none';
}

function showpe() {
    ocultarSecciones();
    document.getElementById('perfil-contenedor').style.display = 'block';
}

function mostrarMantenimiento() {
    alert("Lo sentimos, esta opción está en mantenimiento.");
}

function showmd() {
    ocultarSecciones();
    document.getElementById('mis-datos-contenedor').style.display = 'block';
}

function showhdp() {
    ocultarSecciones();
    document.getElementById('historial-pagos-contenedor').style.display = 'block';
}


//------------------Relacionado al perfil------------------------
async function obtenerSesionUsuario() {
    try {
        const response = await fetch("/auth/session", {
            method: 'GET',
            credentials: 'same-origin',
        });
        const data = await response.json();
        console.log("Datos de sesión:", data);

        if (data.success) {
            return data.user; // Devuelve el usuario completo, incluyendo el RUT y nombre
        } else {
            alert("La sesión ha expirado. Por favor, inicia sesión nuevamente.");
            window.location.href = "login.html";  // Redirigir al login si la sesión ha expirado
        }
    } catch (error) {
        console.error("Error al obtener la sesión:", error);
        alert("Error al verificar la sesión. Intenta nuevamente más tarde.");
    }
}


async function obtenerPerfil(rut) {
    try {
        const response = await fetch(`/auth/profile/${rut}`);
        const data = await response.json();

        if (data.success) {
            const primerNombre = data.profile.nombreCompleto.split(' ')[0];
            document.getElementById('mensaje-inicio').innerText = `¡Bienvenido/a ${primerNombre} :D!`;

            // Actualizar la sección de "Pagar"
            document.getElementById('userNamePago').innerText = primerNombre;
            document.getElementById('debtAmount').innerText = data.profile.deuda || " Tu cuenta se encuentra al día";

            // Resto de los datos de perfil
            document.getElementById('nombre-usuario').innerText = data.profile.nombreCompleto || "Nombre no disponible";
            document.getElementById('perfil-canal').innerText = data.profile.canal || "No asociado";
            document.getElementById('perfil-directiva').innerText = data.profile.directiva || "No asociado";
            document.getElementById('perfil-comuna').innerText = data.profile.comuna || "No disponible";
            document.getElementById('perfil-region').innerText = data.profile.region || "No disponible";
            document.getElementById('perfil-correo').innerText = data.profile.correo || "No disponible";
            document.getElementById('perfil-telefono').innerText = data.profile.telefono || "No disponible";

            ocultarLoader(); // Oculta el loader al completar
        } else {
            mostrarMensajeError("Error al cargar el perfil.");
        }
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        mostrarMensajeError("Sus datos se están cargando ;).");
    }
}

// Función para mostrar la sección de "Pagar"
async function showpa() {
    ocultarSecciones(); // Oculta otras secciones
    document.getElementById('pagar-contenedor').style.display = 'block'; // Muestra "Pagar"

    // Obtener datos del usuario
    const usuario = await obtenerSesionUsuario();
    if (usuario) {
        // Cargar y mostrar perfil con la deuda
        await obtenerPerfil(usuario.rut);
    }
}

async function obtenerMisDatos(rut) {
    try {
        const response = await fetch(`/auth/profile/${rut}`);
        const data = await response.json();

        console.log("Datos recibidos:", data);

        if (data.success) {
            document.getElementById('mis-datos-rut').innerText = rut;
            document.getElementById('mis-datos-rol').innerText = data.profile.rol || "No disponible";
            document.getElementById('mis-datos-nombre').innerText = data.profile.nombreCompleto.split(' ')[0];
            document.getElementById('mis-datos-apellido-paterno').innerText = data.profile.nombreCompleto.split(' ')[1] || "No disponible";
            document.getElementById('mis-datos-apellido-materno').innerText = data.profile.nombreCompleto.split(' ')[2] || "No disponible";
            document.getElementById('mis-datos-region').innerText = data.profile.region || "No disponible";
            document.getElementById('mis-datos-correo').innerText = data.profile.correo || "No disponible";
            document.getElementById('mis-datos-telefono').innerText = data.profile.telefono || "No disponible";

            ocultarLoader(); // Oculta el loader al completar
        } else {
            console.error("Error al obtener los datos:", data.message);
            mostrarMensajeError("No se pudo cargar el perfil.");

        }
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        mostrarMensajeError("No se pudo cargar el perfil.");
    }
}

// Llama a obtenerPerfil con el RUT dinámico
(async () => {
    const usuario = await obtenerSesionUsuario();
    if (usuario) {
        await obtenerPerfil(usuario.rut); // Cargar perfil después de obtener sesión
    } else {
        mostrarMensajeError("No se pudo obtener la sesión.");
    }
})();

//---------------------fin--------------------------------------------------
// Función para mostrar "Mis Datos"
async function showmd() {
    ocultarSecciones();  // Oculta otras secciones si las hay
    document.getElementById('mis-datos-contenedor').style.display = 'block'; // Muestra Mis Datos
    
    // Obtiene los datos del usuario logueado
    const usuario = await obtenerSesionUsuario(); 
    if (usuario) {
        // Llama a la API de perfil para obtener los datos del usuario
        obtenerMisDatos(usuario.rut);
    }
}

// Función para los mensajes recualiaos de error

function mostrarMensajeError(mensaje) {
    const errorContainer = document.getElementById('mensaje-error');
    if (errorContainer) {
        errorContainer.innerText = mensaje; // Inserta el mensaje
        errorContainer.style.display = 'block'; // Hazlo visible

        // Ocultar automáticamente el mensaje después de 5 segundos
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 2000);
    }
}


function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

(async () => {
    const usuario = await obtenerSesionUsuario();
    if (usuario) {
        await obtenerPerfil(usuario.rut);
    }
    ocultarLoader(); // Oculta el loader incluso si no hay datos adicionales
})();

setTimeout(() => {
    ocultarLoader();
}, 5000); // Oculta el loader después de 5 segundos


//------------------Relacionado al historial de pagos------------------------
function mostrarHistorial(event) {
    event.preventDefault();

    // Obtén los valores seleccionados
    const mes = document.getElementById('mes').value;
    const anio = document.getElementById('anio').value;

    // Formatea los datos del mes
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const mesNombre = meses[mes - 1];

    // Muestra el resultado en el contenedor
    const resultado = document.getElementById('resultado-historial');
    resultado.innerHTML = `
        <p>Mostrando historial de pagos para:</p>
        <strong>${mesNombre} ${anio}</strong>
        <p>No hay registros disponibles en este momento.</p>
    `;
}
//-----------------------Hasta aca----------------------------------------