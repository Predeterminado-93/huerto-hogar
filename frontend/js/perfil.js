const datosPerfil = document.getElementById("datos-perfil");
const usuarioGuardado = localStorage.getItem("usuarioRegistrado");
const sesionActiva = localStorage.getItem("sesionActiva");

if (sesionActiva !== "true") {
    datosPerfil.innerHTML = `
        <p>Debes iniciar sesión para consultar tu perfil.</p>
        <a href="login.html">Ir al inicio de sesión</a>
    `;
} else if (!usuarioGuardado) {
    datosPerfil.innerHTML = `
        <p>No se encontraron datos de usuario registrados.</p>
        <a href="registro.html">Registrarse</a>
    `;
} else {
    const usuario = JSON.parse(usuarioGuardado);

    datosPerfil.innerHTML = `
        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
        <p><strong>Correo:</strong> ${usuario.correo}</p>
        <p><strong>Estado:</strong> Sesión activa</p>
        <button id="boton-cerrar-sesion">Cerrar sesión</button>
    `;

    const botonCerrarSesion = document.getElementById("boton-cerrar-sesion");

    botonCerrarSesion.addEventListener("click", function() {
        localStorage.removeItem("sesionActiva");
        window.location.href = "login.html";
    });
}