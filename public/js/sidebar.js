// toggleSidebar.js
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    const content = document.getElementById('content-container');
    const mainHeader = document.querySelector('.main-header');
    const menuIcon = document.getElementById('menu-icon');

    if (sidebar && content && mainHeader) {
        // Alterna las clases de estilo para el sidebar y el contenido
        sidebar.classList.toggle('open');
        content.classList.toggle('expanded');
        mainHeader.classList.toggle('expanded');
    } else {
        console.error("No se encontraron los elementos sidebar, content o mainHeader.");
    }
}