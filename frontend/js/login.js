const formularioLogin = document.getElementById("formulario-login");

formularioLogin.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const correo = document.getElementById("correo").value.trim();
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

    if (formularioValido) {
        const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

        if (!usuarioGuardado) {
            errorCorreo.textContent = "No existe un usuario registrado.";
            return;
        }

        const usuario = JSON.parse(usuarioGuardado);

        if (correo !== usuario.correo || contrasena !== usuario.contrasena) {
            errorCorreo.textContent = "El correo o la contraseña son incorrectos.";
            return;
        }

        localStorage.setItem("sesionActiva", "true");
        alert("Inicio de sesión exitoso.");
        window.location.href = "index.html";
    }
});