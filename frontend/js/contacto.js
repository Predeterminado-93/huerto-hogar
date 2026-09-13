const formularioContacto = document.getElementById("formulario-contacto");

formularioContacto.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    const errorNombre = document.getElementById("error-nombre");
    const errorCorreo = document.getElementById("error-correo");
    const errorComentario = document.getElementById("error-comentario");

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorComentario.textContent = "";

    let formularioValido = true;

    if (nombre === "") {
        errorNombre.textContent = "El nombre es obligatorio.";
        formularioValido = false;
    } else if (nombre.length > 100) {
        errorNombre.textContent = "El nombre no puede superar los 100 caracteres.";
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
        errorCorreo.textContent = "El correo electrónico es obligatorio.";
        formularioValido = false;
    } else if (correo.length > 100) {
        errorCorreo.textContent = "El correo no puede superar los 100 caracteres.";
        formularioValido = false;
    } else if (!correoValido) {
        errorCorreo.textContent = "Utiliza un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        formularioValido = false;
    }

    if (comentario === "") {
        errorComentario.textContent = "El comentario es obligatorio.";
        formularioValido = false;
    } else if (comentario.length > 500) {
        errorComentario.textContent = "El comentario no puede superar los 500 caracteres.";
        formularioValido = false;
    }

    if (formularioValido) {
        alert("Mensaje enviado correctamente.");
        formularioContacto.reset();
    }
});