const formulario = document.getElementById("formulario-registro");

const regionesYComunas = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte"],
    "Antofagasta": ["Antofagasta", "Calama", "Tocopilla"],
    "Atacama": ["Copiapó", "Caldera", "Vallenar"],
    "Coquimbo": ["La Serena", "Coquimbo", "Ovalle"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Metropolitana": ["Santiago", "Maipú", "Puente Alto"],
    "O'Higgins": ["Rancagua", "San Fernando", "Rengo"],
    "Maule": ["Talca", "Curicó", "Linares"],
    "Ñuble": ["Chillán", "San Carlos", "Bulnes"],
    "Biobío": ["Concepción", "Los Ángeles", "Talcahuano"],
    "La Araucanía": ["Temuco", "Villarrica", "Angol"],
    "Los Ríos": ["Valdivia", "La Unión", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Osorno", "Castro"],
    "Aysén": ["Coyhaique", "Puerto Aysén", "Chile Chico"],
    "Magallanes": ["Punta Arenas", "Puerto Natales", "Porvenir"]
};

const selectorRegion = document.getElementById("region");
const selectorComuna = document.getElementById("comuna");

function cargarRegiones() {
    Object.keys(regionesYComunas).forEach(function(region) {
        const opcion = document.createElement("option");

        opcion.value = region;
        opcion.textContent = region;

        selectorRegion.appendChild(opcion);
    });
}

function cargarComunas() {
    selectorComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

    const comunas = regionesYComunas[selectorRegion.value] || [];

    comunas.forEach(function(comuna) {
        const opcion = document.createElement("option");

        opcion.value = comuna;
        opcion.textContent = comuna;

        selectorComuna.appendChild(opcion);
    });
}

function validarRun(run) {
    return /^[0-9]{7,9}$/.test(run);
}

function validarCorreo(correo) {
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
}

selectorRegion.addEventListener("change", cargarComunas);

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    const region = selectorRegion.value;
    const comuna = selectorComuna.value;
    const direccion = document.getElementById("direccion").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const confirmarContrasena = document.getElementById("confirmar-contrasena").value;

    const errorRun = document.getElementById("error-run");
    const errorNombre = document.getElementById("error-nombre");
    const errorApellidos = document.getElementById("error-apellidos");
    const errorCorreo = document.getElementById("error-correo");
    const errorRegion = document.getElementById("error-region");
    const errorComuna = document.getElementById("error-comuna");
    const errorDireccion = document.getElementById("error-direccion");
    const errorContrasena = document.getElementById("error-contrasena");
    const errorConfirmarContrasena = document.getElementById("error-confirmar-contrasena");

    errorRun.textContent = "";
    errorNombre.textContent = "";
    errorApellidos.textContent = "";
    errorCorreo.textContent = "";
    errorRegion.textContent = "";
    errorComuna.textContent = "";
    errorDireccion.textContent = "";
    errorContrasena.textContent = "";
    errorConfirmarContrasena.textContent = "";

    let formularioValido = true;

    if (run === "") {
        errorRun.textContent = "Debes ingresar tu RUN.";
        formularioValido = false;
    } else if (!validarRun(run)) {
        errorRun.textContent = "El RUN debe contener entre 7 y 9 números, sin puntos ni guion.";
        formularioValido = false;
    }

    if (nombre === "") {
        errorNombre.textContent = "Debes ingresar tu nombre.";
        formularioValido = false;
    } else if (nombre.length > 50) {
        errorNombre.textContent = "El nombre no puede superar los 50 caracteres.";
        formularioValido = false;
    }

    if (apellidos === "") {
        errorApellidos.textContent = "Debes ingresar tus apellidos.";
        formularioValido = false;
    } else if (apellidos.length > 100) {
        errorApellidos.textContent = "Los apellidos no pueden superar los 100 caracteres.";
        formularioValido = false;
    }

    if (correo === "") {
        errorCorreo.textContent = "Debes ingresar tu correo.";
        formularioValido = false;
    } else if (correo.length > 100 || !validarCorreo(correo)) {
        errorCorreo.textContent = "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        formularioValido = false;
    }

    if (region === "") {
        errorRegion.textContent = "Debes seleccionar una región.";
        formularioValido = false;
    }

    if (comuna === "") {
        errorComuna.textContent = "Debes seleccionar una comuna.";
        formularioValido = false;
    }

    if (direccion === "") {
        errorDireccion.textContent = "Debes ingresar tu dirección.";
        formularioValido = false;
    } else if (direccion.length > 300) {
        errorDireccion.textContent = "La dirección no puede superar los 300 caracteres.";
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

    if (!formularioValido) {
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const runExistente = usuarios.some(function(usuario) {
        return usuario.run === run;
    });

    if (runExistente) {
        errorRun.textContent = "Ya existe un usuario registrado con ese RUN.";
        return;
    }

    const correoExistente = usuarios.some(function(usuario) {
        return usuario.correo === correo;
    });

    if (correoExistente) {
        errorCorreo.textContent = "Ya existe un usuario registrado con ese correo.";
        return;
    }

    const usuario = {
        run: run,
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        fechaNacimiento: fechaNacimiento,
        tipo: "Cliente",
        region: region,
        comuna: comuna,
        direccion: direccion,
        contrasena: contrasena
    };

    usuarios.push(usuario);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));

    alert("Registro realizado correctamente.");
    formulario.reset();

    selectorComuna.innerHTML = '<option value="">Selecciona una comuna</option>';
});

cargarRegiones();