document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Muestra el loader
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Oculta el formulario
    const formContainer = document.querySelector('.contenedor');
    formContainer.style.display = 'none';

    // Cargar el CSS de la animación solo en este momento
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/animacion.css';
    document.head.appendChild(link);

    const rut = document.querySelector('input[name="rut"]').value;
    const password = document.querySelector('input[name="password"]').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rut, password })
        });

        const data = await response.json();
        console.log("Respuesta completa del servidor:", data);
        
        // Simular un retraso de 2 segundos para que se vea la animación
        await new Promise(resolve => setTimeout(resolve, 4000));

        if (data.success) {
            const rol = data.data?.rol; // Acceso al rol correcto
            if (rol === "admin") {
                window.location.href = "/admin.html";
            } else if (rol === "user") {
                window.location.href = "/user.html";
            } else {
                alert(`Rol desconocido: ${rol}`);
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema con el inicio de sesión.");
    } finally {
        // Oculta el loader al terminar
        loader.style.display = 'none';
    }
});
