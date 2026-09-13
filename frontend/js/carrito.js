const carritoGuardado = localStorage.getItem("carrito");

const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

const listaCarrito = document.getElementById("lista-carrito");

function calcularTotal() {
    let subtotal = 0;

    carrito.forEach(function(producto) {
        subtotal += producto.precio * producto.cantidad;
    });

    document.getElementById("subtotal").textContent = subtotal;
    document.getElementById("total").textContent = subtotal;
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";
    if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
}

    carrito.forEach(function(producto, indice) {
        const elemento = document.createElement("article");

        elemento.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio unitario: $${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button class="boton-aumentar">+</button>
            <button class="boton-disminuir">-</button>
            <p>Subtotal: $${producto.precio * producto.cantidad}</p>
            <button class="boton-eliminar">Eliminar</button>            
        `;

        const botonEliminar = elemento.querySelector(".boton-eliminar");
        const botonAumentar = elemento.querySelector(".boton-aumentar");
        const botonDisminuir = elemento.querySelector(".boton-disminuir");

        botonAumentar.addEventListener("click", function() {
            producto.cantidad++;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
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

mostrarCarrito();