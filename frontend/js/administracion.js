const formularioProducto = document.getElementById("formulario-producto");
const listaAdministracion = document.getElementById("lista-administracion");

function mostrarProductosAdministracion() {
    listaAdministracion.innerHTML = "";

    productos.forEach(function(producto, indice) {
        const elemento = document.createElement("article");

        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Categoría: ${producto.categoria}</p>
            <p>Estado: ${producto.disponible ? "Disponible" : "Agotado"}</p>
            <button class="boton-eliminar-producto">Eliminar</button>
        `;

        const botonEliminar = elemento.querySelector(".boton-eliminar-producto");

        botonEliminar.addEventListener("click", function() {
            productos.splice(indice, 1);
            mostrarProductosAdministracion();
        });

        listaAdministracion.appendChild(elemento);
    });
}

formularioProducto.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre-producto").value.trim();
    const precio = Number(document.getElementById("precio-producto").value);
    const categoria = document.getElementById("categoria-producto").value.trim();
    const disponible = document.getElementById("disponible-producto").value === "true";

    if (nombre === "" || precio <= 0 || categoria === "") {
        alert("Completa correctamente todos los campos.");
        return;
    }

    productos.push({
        id: productos.length + 1,
        nombre: nombre,
        precio: precio,
        categoria: categoria,
        descripcion: "Producto agregado desde administración.",
        disponible: disponible
    });

    formularioProducto.reset();
    mostrarProductosAdministracion();
});

mostrarProductosAdministracion();