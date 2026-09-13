const formulario = document.getElementById("formulario-registro");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const confirmarContrasena = document.getElementById("confirmar-contrasena").value;

    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorContrasena = document.getElementById("error-contrasena");
    const errorConfirmarContrasena = document.getElementById("error-confirmar-contrasena");

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorContrasena.textContent = "";
    errorConfirmarContrasena.textContent = "";

    let formularioValido = true;

    if (nombre === "") {
        errorNombre.textContent = "Debes ingresar tu nombre.";
        formularioValido = false;
    }

    const dominiosPermitidos = [
        "@duoc.cl",
        "@profesor.duoc.cl",
        "@gmail.com"
    ];

    const correoValido = dominiosPermitidos.some(function(dominio) {
        return correo.endsWith(dominio);
    });

    if (correo === "") {
        errorCorreo.textContent = "Debes ingresar tu correo.";
        formularioValido = false;
    } else if (!correoValido) {
        errorCorreo.textContent = "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        formularioValido = false;
    }

    if (contrasena === "") {
        errorContrasena.textContent = "Debes ingresar una contraseña.";
        formularioValido = false;
    } else if (contrasena.length < 4 || contrasena.length > 10) {
        errorContrasena.textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
        formularioValido = false;
    }

    if (confirmarContrasena === "") {
        errorConfirmarContrasena.textContent = "Debes confirmar tu contraseña.";
        formularioValido = false;
    } else if (contrasena !== confirmarContrasena) {
        errorConfirmarContrasena.textContent = "Las contraseñas no coinciden.";
        formularioValido = false;
    }

    if (formularioValido) {
        const usuario = {
            nombre: nombre,
            correo: correo,
            contrasena: contrasena
        };

        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));

        alert("Registro realizado correctamente.");
        formulario.reset();
    }
});