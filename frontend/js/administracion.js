const formularioProducto = document.getElementById("formulario-producto");
const listaAdministracion = document.getElementById("lista-administracion");
const listaUsuarios = document.getElementById("lista-usuarios");
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

function mostrarUsuarios() {
    listaUsuarios.innerHTML = "";

    const usuarioGuardado = localStorage.getItem("usuarioRegistrado");

    if (!usuarioGuardado) {
        listaUsuarios.innerHTML = "<p>No hay usuarios registrados.</p>";
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    const elemento = document.createElement("article");

    elemento.innerHTML = `
        <h3>Usuario registrado</h3>
        <p><strong>Nombre:</strong> ${usuario.nombre}</p>
        <p><strong>Correo:</strong> ${usuario.correo}</p>
        <p><strong>Estado:</strong> ${localStorage.getItem("sesionActiva") === "true" ? "Sesión activa" : "Sesión inactiva"}</p>
    `;

    listaUsuarios.appendChild(elemento);
}

function limpiarFormulario() {
    formularioProducto.reset();
    indiceEdicion = -1;
    botonGuardar.textContent = "Agregar producto";
    botonCancelar.hidden = true;
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
    limpiarFormulario();
    mostrarProductosAdministracion();
});

botonCancelar.addEventListener("click", function() {
    limpiarFormulario();
});

mostrarProductosAdministracion();
mostrarUsuarios();