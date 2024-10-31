document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

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
            alert(data.message); // Puedes redirigir a otra página aquí si el login es exitoso
            // window.location.href = "/dashboard";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema con el inicio de sesión.");
    }
});