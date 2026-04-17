// Local: /js/app.js
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('sidebar-container', '/components/sidebar.html');
    loadComponent('navbar-container', '/components/navbar.html');
    
    // Inicializa lógica da dashboard
    initDashboard();
});

async function loadComponent(id, path) {
    const element = document.getElementById(id);
    try {
        const response = await fetch(path);
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error(`Erro ao carregar componente ${path}:`, error);
    }
}

function initDashboard() {
    console.log("Dashboard carregada com sucesso!");
}