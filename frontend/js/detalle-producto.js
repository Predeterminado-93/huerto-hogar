const parametros = new URLSearchParams(window.location.search);
const idProducto = Number(parametros.get("id"));

const producto = productos.find(function(item) {
    return item.id === idProducto;
});

const nombreProducto = document.getElementById("nombre-producto");
const imagenProducto = document.getElementById("imagen-producto");
const descripcionProducto = document.getElementById("descripcion-producto");
const precioProducto = document.getElementById("precio-producto");
const categoriaProducto = document.getElementById("categoria-producto");
const estadoProducto = document.getElementById("estado-producto");
const botonAgregar = document.getElementById("boton-agregar-detalle");
const mensajeDetalle = document.getElementById("mensaje-detalle");
const cantidadProducto = document.getElementById("cantidad-producto");

if (producto) {
    nombreProducto.textContent = producto.nombre;
    imagenProducto.src = producto.imagen || "img/producto-generico.jpg";
    imagenProducto.alt = producto.nombre;
    descripcionProducto.textContent = producto.descripcion;
    precioProducto.textContent = "Precio: $" + producto.precio;
    categoriaProducto.textContent = "Categoría: " + producto.categoria;

    if (producto.stock > 0 && producto.disponible) {
        estadoProducto.textContent = "Estado: Disponible";
        estadoProducto.className = "disponible";
        cantidadProducto.max = producto.stock;

        botonAgregar.addEventListener("click", function() {
            const cantidad = Number(cantidadProducto.value);

            if (cantidad < 1 || cantidad > producto.stock) {
                mensajeDetalle.textContent = "La cantidad debe estar entre 1 y " + producto.stock + ".";
                return;
            }

            const productoExistente = carrito.find(function(item) {
                return item.id === producto.id;
            });

            if (productoExistente) {
                if (productoExistente.cantidad + cantidad > producto.stock) {
                    mensajeDetalle.textContent = "La cantidad supera el stock disponible.";
                    return;
                }

                productoExistente.cantidad += cantidad;
            } else {
                carrito.push({
                    ...producto,
                    cantidad: cantidad
                });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            mensajeDetalle.textContent = "Producto agregado al carrito.";
        });
    } else {
        estadoProducto.textContent = "Estado: Agotado";
        estadoProducto.className = "agotado";
        botonAgregar.disabled = true;
        cantidadProducto.disabled = true;
        botonAgregar.textContent = "Producto agotado";
    }
} else {
    nombreProducto.textContent = "Producto no encontrado";
    imagenProducto.style.display = "none";
    descripcionProducto.textContent = "No se encontró el producto solicitado.";
    botonAgregar.disabled = true;
    cantidadProducto.disabled = true;
}