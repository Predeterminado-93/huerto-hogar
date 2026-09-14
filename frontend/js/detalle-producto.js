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
    } else {
        estadoProducto.textContent = "Estado: Agotado";
        estadoProducto.className = "agotado";
    }
} else {
    nombreProducto.textContent = "Producto no encontrado";
    imagenProducto.style.display = "none";
    descripcionProducto.textContent = "No se encontró el producto solicitado.";
    precioProducto.textContent = "";
    categoriaProducto.textContent = "";
    estadoProducto.textContent = "";
}