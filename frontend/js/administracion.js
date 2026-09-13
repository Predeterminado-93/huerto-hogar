const formularioProducto = document.getElementById("formulario-producto");
const listaAdministracion = document.getElementById("lista-administracion");

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
            <h3>${producto.nombre}</h3>
            <p>Código: ${producto.codigo || "Sin código"}</p>
            <p>Descripción: ${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock ?? "No informado"}</p>
            <p>Stock crítico: ${producto.stockCritico ?? "No informado"}</p>
            <p>Categoría: ${producto.categoria}</p>
            <p>Estado: ${producto.stock > 0 ? "Disponible" : "Agotado"}</p>
            <button class="boton-eliminar-producto">Eliminar</button>
        `;

        const botonEliminar = elemento.querySelector(".boton-eliminar-producto");

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

    if (codigo === "" || nombre === "" || precio < 0 || stock < 0 || categoria === "") {
        alert("Completa correctamente los campos obligatorios.");
        return;
    }

    const codigoExistente = productos.some(function(producto) {
        return producto.codigo === codigo;
    });

    if (codigoExistente) {
        alert("Ya existe un producto con ese código.");
        return;
    }

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
        disponible: stock > 0
    });

    guardarProductos();
    formularioProducto.reset();
    mostrarProductosAdministracion();
});

mostrarProductosAdministracion();