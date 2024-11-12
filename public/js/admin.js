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