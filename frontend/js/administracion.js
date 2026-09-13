const formularioProducto = document.getElementById("formulario-producto");
const listaAdministracion = document.getElementById("lista-administracion");
const botonGuardar = document.getElementById("boton-guardar-producto");
const botonCancelar = document.getElementById("boton-cancelar-edicion");

let indiceEdicion = -1;

function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function mostrarProductosAdministracion() {
    listaAdministracion.innerHTML = "";

    if (productos.length === 0) {
        listaAdministracion.innerHTML = "<p>No hay productos registrados.</p>";
    }

    productos.forEach(function(producto, indice) {
        const elemento = document.createElement("article");

        elemento.innerHTML = `
            <img src="${producto.imagen || "img/producto-generico.jpg"}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Código: ${producto.codigo || "Sin código"}</p>
            <p>Descripción: ${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock ?? "No informado"}</p>
            <p>Stock crítico: ${producto.stockCritico ?? "No informado"}</p>
            <p>Categoría: ${producto.categoria}</p>
            <p>Imagen: ${producto.imagen || "Sin imagen"}</p>
            <p>Estado: ${producto.stock > 0 ? "Disponible" : "Agotado"}</p>
            <p>${producto.stock <= producto.stockCritico ? "Alerta: stock crítico" : "Stock suficiente"}</p>
            <button class="boton-editar-producto">Editar</button>
            <button class="boton-eliminar-producto">Eliminar</button>
        `;

        const botonEditar = elemento.querySelector(".boton-editar-producto");
        const botonEliminar = elemento.querySelector(".boton-eliminar-producto");

        botonEditar.addEventListener("click", function() {
            document.getElementById("codigo-producto").value = producto.codigo || "";
            document.getElementById("nombre-producto").value = producto.nombre;
            document.getElementById("descripcion-producto").value = producto.descripcion;
            document.getElementById("precio-producto").value = producto.precio;
            document.getElementById("stock-producto").value = producto.stock;
            document.getElementById("stock-critico-producto").value = producto.stockCritico;
            document.getElementById("categoria-producto").value = producto.categoria;
            document.getElementById("imagen-producto").value = producto.imagen || "";

            indiceEdicion = indice;
            botonGuardar.textContent = "Guardar cambios";
            botonCancelar.hidden = false;

            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        botonEliminar.addEventListener("click", function() {
            productos.splice(indice, 1);
            guardarProductos();
            mostrarProductosAdministracion();
        });

        listaAdministracion.appendChild(elemento);
    });
}

formularioProducto.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const codigo = document.getElementById("codigo-producto").value.trim();
    const nombre = document.getElementById("nombre-producto").value.trim();
    const descripcion = document.getElementById("descripcion-producto").value.trim();
    const precio = Number(document.getElementById("precio-producto").value);
    const stock = Number(document.getElementById("stock-producto").value);
    const stockCritico = Number(document.getElementById("stock-critico-producto").value || 0);
    const categoria = document.getElementById("categoria-producto").value;
    const imagen = document.getElementById("imagen-producto").value.trim();

    if (codigo === "" || nombre === "" || precio < 0 || stock < 0 || categoria === "") {
        alert("Completa correctamente los campos obligatorios.");
        return;
    }

    const codigoExistente = productos.some(function(producto, indice) {
        return producto.codigo === codigo && indice !== indiceEdicion;
    });

    if (codigoExistente) {
        alert("Ya existe un producto con ese código.");
        return;
    }

    if (indiceEdicion === -1) {
        productos.push({
            id: Math.max(...productos.map(function(producto) {
                return producto.id;
            }), 0) + 1,
            codigo: codigo,
            nombre: nombre,
            descripcion: descripcion || "Producto agregado desde administración.",
            precio: precio,
            stock: stock,
            stockCritico: stockCritico,
            categoria: categoria,
            disponible: stock > 0,
            imagen: imagen || "img/producto-generico.jpg"
        });
    } else {
        productos[indiceEdicion].codigo = codigo;
        productos[indiceEdicion].nombre = nombre;
        productos[indiceEdicion].descripcion = descripcion || "Producto agregado desde administración.";
        productos[indiceEdicion].precio = precio;
        productos[indiceEdicion].stock = stock;
        productos[indiceEdicion].stockCritico = stockCritico;
        productos[indiceEdicion].categoria = categoria;
        productos[indiceEdicion].disponible = stock > 0;
        productos[indiceEdicion].imagen = imagen || "img/producto-generico.jpg";
    }

    guardarProductos();
    limpiarFormularioProducto();
    mostrarProductosAdministracion();
});

function limpiarFormularioProducto() {
    formularioProducto.reset();
    indiceEdicion = -1;
    botonGuardar.textContent = "Agregar producto";
    botonCancelar.hidden = true;
}

botonCancelar.addEventListener("click", function() {
    limpiarFormularioProducto();
});


const formularioUsuario = document.getElementById("formulario-usuario");
const listaUsuarios = document.getElementById("lista-usuarios");
const botonGuardarUsuario = document.getElementById("boton-guardar-usuario");
const botonCancelarUsuario = document.getElementById("boton-cancelar-edicion-usuario");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let indiceEdicionUsuario = -1;

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

function cargarRegiones() {
    const selectorRegion = document.getElementById("region-usuario");

    Object.keys(regionesYComunas).forEach(function(region) {
        const opcion = document.createElement("option");
        opcion.value = region;
        opcion.textContent = region;
        selectorRegion.appendChild(opcion);
    });
}

function cargarComunas() {
    const selectorRegion = document.getElementById("region-usuario");
    const selectorComuna = document.getElementById("comuna-usuario");

    selectorComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

    const comunas = regionesYComunas[selectorRegion.value] || [];

    comunas.forEach(function(comuna) {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        selectorComuna.appendChild(opcion);
    });
}

function guardarUsuarios() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function validarRun(run) {
    return /^[0-9]{7,9}$/.test(run);
}

function validarCorreo(correo) {
    return /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
}

function mostrarUsuarios() {
    listaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
        listaUsuarios.innerHTML = "<p>No hay usuarios registrados.</p>";
        return;
    }

    usuarios.forEach(function(usuario, indice) {
        const elemento = document.createElement("article");

        elemento.innerHTML = `
            <h3>${usuario.nombre} ${usuario.apellidos}</h3>
            <p>RUN: ${usuario.run}</p>
            <p>Correo: ${usuario.correo}</p>
            <p>Fecha de nacimiento: ${usuario.fechaNacimiento || "No informada"}</p>
            <p>Tipo de usuario: ${usuario.tipo}</p>
            <p>Región: ${usuario.region}</p>
            <p>Comuna: ${usuario.comuna}</p>
            <p>Dirección: ${usuario.direccion}</p>
            <button class="boton-editar-usuario">Editar</button>
            <button class="boton-eliminar-usuario">Eliminar</button>
        `;

        elemento.querySelector(".boton-editar-usuario").addEventListener("click", function() {
            document.getElementById("run-usuario").value = usuario.run;
            document.getElementById("nombre-usuario").value = usuario.nombre;
            document.getElementById("apellidos-usuario").value = usuario.apellidos;
            document.getElementById("correo-usuario").value = usuario.correo;
            document.getElementById("fecha-nacimiento-usuario").value = usuario.fechaNacimiento || "";
            document.getElementById("tipo-usuario").value = usuario.tipo;
            document.getElementById("region-usuario").value = usuario.region;

            cargarComunas();

            document.getElementById("comuna-usuario").value = usuario.comuna;
            document.getElementById("direccion-usuario").value = usuario.direccion;

            indiceEdicionUsuario = indice;
            botonGuardarUsuario.textContent = "Guardar cambios";
            botonCancelarUsuario.hidden = false;

            window.scrollTo({ top: document.getElementById("formulario-usuario").offsetTop, behavior: "smooth" });
        });

        elemento.querySelector(".boton-eliminar-usuario").addEventListener("click", function() {
            usuarios.splice(indice, 1);
            guardarUsuarios();
            mostrarUsuarios();
        });

        listaUsuarios.appendChild(elemento);
    });
}

function limpiarFormularioUsuario() {
    formularioUsuario.reset();
    document.getElementById("comuna-usuario").innerHTML = '<option value="">Selecciona una comuna</option>';
    indiceEdicionUsuario = -1;
    botonGuardarUsuario.textContent = "Agregar usuario";
    botonCancelarUsuario.hidden = true;
}

formularioUsuario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const run = document.getElementById("run-usuario").value.trim();
    const nombre = document.getElementById("nombre-usuario").value.trim();
    const apellidos = document.getElementById("apellidos-usuario").value.trim();
    const correo = document.getElementById("correo-usuario").value.trim().toLowerCase();
    const fechaNacimiento = document.getElementById("fecha-nacimiento-usuario").value;
    const tipo = document.getElementById("tipo-usuario").value;
    const region = document.getElementById("region-usuario").value;
    const comuna = document.getElementById("comuna-usuario").value;
    const direccion = document.getElementById("direccion-usuario").value.trim();

    if (!validarRun(run)) {
        alert("El RUN debe contener entre 7 y 9 números, sin puntos ni guion.");
        return;
    }

    if (nombre === "" || nombre.length > 50) {
        alert("El nombre es obligatorio y debe tener máximo 50 caracteres.");
        return;
    }

    if (apellidos === "" || apellidos.length > 100) {
        alert("Los apellidos son obligatorios y deben tener máximo 100 caracteres.");
        return;
    }

    if (!validarCorreo(correo) || correo.length > 100) {
        alert("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return;
    }

    if (tipo === "" || region === "" || comuna === "") {
        alert("Selecciona el tipo de usuario, región y comuna.");
        return;
    }

    if (direccion === "" || direccion.length > 300) {
        alert("La dirección es obligatoria y debe tener máximo 300 caracteres.");
        return;
    }

    const runExistente = usuarios.some(function(usuario, indice) {
        return usuario.run === run && indice !== indiceEdicionUsuario;
    });

    if (runExistente) {
        alert("Ya existe un usuario registrado con ese RUN.");
        return;
    }

    const usuario = {
        run: run,
        nombre: nombre,
        apellidos: apellidos,
        correo: correo,
        fechaNacimiento: fechaNacimiento,
        tipo: tipo,
        region: region,
        comuna: comuna,
        direccion: direccion
    };

    if (indiceEdicionUsuario === -1) {
        usuarios.push(usuario);
    } else {
        usuarios[indiceEdicionUsuario] = usuario;
    }

    guardarUsuarios();
    limpiarFormularioUsuario();
    mostrarUsuarios();

    alert("Usuario guardado correctamente.");
});

botonCancelarUsuario.addEventListener("click", function() {
    limpiarFormularioUsuario();
});

document.getElementById("region-usuario").addEventListener("change", cargarComunas);

cargarRegiones();
mostrarProductosAdministracion();
mostrarUsuarios();