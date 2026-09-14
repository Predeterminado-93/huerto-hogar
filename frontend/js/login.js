const formularioLogin = document.getElementById("formulario-login");

formularioLogin.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const contrasena = document.getElementById("contrasena").value;

    const errorCorreo = document.getElementById("error-correo");
    const errorContrasena = document.getElementById("error-contrasena");

    errorCorreo.textContent = "";
    errorContrasena.textContent = "";

    let formularioValido = true;

    const dominiosPermitidos = [
        "@duoc.cl",
        "@profesor.duoc.cl",
        "@gmail.com"
    ];

    const correoValido = dominiosPermitidos.some(function(dominio) {
        return correo.endsWith(dominio);
    });

    if (correo === "") {
        errorCorreo.textContent = "El correo electrónico es obligatorio.";
        formularioValido = false;
    } else if (correo.length > 100) {
        errorCorreo.textContent = "El correo no puede superar los 100 caracteres.";
        formularioValido = false;
    } else if (!correoValido) {
        errorCorreo.textContent = "Utiliza un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        formularioValido = false;
    }

    if (contrasena.length < 4 || contrasena.length > 10) {
        errorContrasena.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
        formularioValido = false;
    }

    if (!formularioValido) {
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(function(item) {
        return item.correo === correo && item.contrasena === contrasena;
    });

    if (!usuario) {
        errorCorreo.textContent = "El correo o la contraseña son incorrectos.";
        return;
    }

    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
    localStorage.setItem("sesionActiva", "true");

    alert("Inicio de sesión exitoso.");
    window.location.href = "index.html";
});