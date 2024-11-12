// public/js/login.js
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

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
        if (data.success) {
            if (data.rol === "admin"){
                window.location.href = "/admin.html";
            } else if (data.rol === "user") {
                window.location.href = "/user.html";
            } else {
                alert("Rol desconocido.");
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema con el inicio de sesión.");
    }
});