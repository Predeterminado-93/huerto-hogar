const parametros = new URLSearchParams(window.location.search);
const idProducto = Number(parametros.get("id"));

const producto = productos.find(function(item) {
    return item.id === idProducto;
});

const nombreProducto = document.getElementById("nombre-producto");
const descripcionProducto = document.getElementById("descripcion-producto");
const precioProducto = document.getElementById("precio-producto");
const categoriaProducto = document.getElementById("categoria-producto");
const estadoProducto = document.getElementById("estado-producto");
const botonAgregar = document.getElementById("boton-agregar-detalle");
const mensajeDetalle = document.getElementById("mensaje-detalle");

if (producto) {
    nombreProducto.textContent = producto.nombre;
    descripcionProducto.textContent = producto.descripcion;
    precioProducto.textContent = "Precio: $" + producto.precio;
    categoriaProducto.textContent = "Categoría: " + producto.categoria;

    if (producto.disponible) {
        estadoProducto.textContent = "Estado: Disponible";
        estadoProducto.className = "disponible";

        botonAgregar.addEventListener("click", function() {
            agregarAlCarrito(producto);
            mensajeDetalle.textContent = "Producto agregado al carrito.";
        });
    } else {
        estadoProducto.textContent = "Estado: Agotado";
        estadoProducto.className = "agotado";
        botonAgregar.disabled = true;
        botonAgregar.textContent = "Producto agotado";
    }
} else {
    nombreProducto.textContent = "Producto no encontrado";
    descripcionProducto.textContent = "No se encontró el producto solicitado.";
    botonAgregar.disabled = true;
}