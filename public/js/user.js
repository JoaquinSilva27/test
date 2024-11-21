function showMsj() {
    ocultarSecciones();
    document.getElementById('contenedor').style.display = 'block';
}

function showpa() {
    ocultarSecciones();
    document.getElementById('pagar-contenedor').style.display = 'block';
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
    alert("Por qué presionas esta opcion imbécil. Si es de bonito noma pa hacerlo mas realista XD.");
}

function showmd() {
    ocultarSecciones();
    document.getElementById('mis-datos-contenedor').style.display = 'block';
}

function showhdp() {
    ocultarSecciones();
    document.getElementById('historial-pagos-contenedor').style.display = 'block';
}

//relacionado al historial de pagos
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