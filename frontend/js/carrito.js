const carritoGuardado = localStorage.getItem("carrito");
const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

const productosGuardados = localStorage.getItem("productos");
const productos = productosGuardados ? JSON.parse(productosGuardados) : [];

const listaCarrito = document.getElementById("lista-carrito");
const botonFinalizar = document.getElementById("boton-finalizar-compra");
const mensajeCompra = document.getElementById("mensaje-compra");

function calcularTotal() {
    let subtotal = 0;

    carrito.forEach(function(producto) {
        subtotal += producto.precio * producto.cantidad;
    });

    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("total").textContent = subtotal;
}

function obtenerStockDisponible(idProducto) {
    const producto = productos.find(function(item) {
        return item.id === idProducto;
    });

    return producto ? producto.stock : 0;
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    }

    carrito.forEach(function(producto, indice) {
        const elemento = document.createElement("article");
        const stockDisponible = obtenerStockDisponible(producto.id);

        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio unitario: $${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Stock disponible: ${stockDisponible}</p>
            <button class="boton-aumentar">+</button>
            <button class="boton-disminuir">-</button>
            <p>Subtotal: $${producto.precio * producto.cantidad}</p>
            <p>Categoría: ${producto.categoria}</p>
            <button class="boton-eliminar">Eliminar</button>
        `;

        const botonEliminar = elemento.querySelector(".boton-eliminar");
        const botonAumentar = elemento.querySelector(".boton-aumentar");
        const botonDisminuir = elemento.querySelector(".boton-disminuir");

        botonAumentar.addEventListener("click", function() {
            if (producto.cantidad < stockDisponible) {
                producto.cantidad++;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                mostrarCarrito();
            } else {
                alert("No puedes superar el stock disponible.");
            }
        });

        botonDisminuir.addEventListener("click", function() {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                carrito.splice(indice, 1);
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });

        botonEliminar.addEventListener("click", function() {
            carrito.splice(indice, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });

        listaCarrito.appendChild(elemento);
    });

    calcularTotal();
}

botonFinalizar.addEventListener("click", function() {
    if (carrito.length === 0) {
        mensajeCompra.textContent = "No puedes finalizar una compra con el carrito vacío.";
        return;
    }

    const sesionActiva = localStorage.getItem("sesionActiva");

    if (sesionActiva !== "true") {
        mensajeCompra.textContent = "Debes iniciar sesión antes de finalizar la compra.";
        return;
    }

    mensajeCompra.textContent = "Compra realizada correctamente. Gracias por comprar en HuertoHogar.";
    carrito.length = 0;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
});

mostrarCarrito();