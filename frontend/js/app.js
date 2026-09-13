const productosIniciales = [
    {
        id: 1,
        codigo: "FRU001",
        nombre: "Manzanas",
        descripcion: "Manzanas frescas cultivadas en Chile.",
        precio: 1500,
        stock: 20,
        stockCritico: 5,
        categoria: "Frutas",
        disponible: true,
        imagen: "img/manzanas.jpg"
    },
    {
        id: 2,
        codigo: "FRU002",
        nombre: "Naranjas",
        descripcion: "Naranjas jugosas y naturales.",
        precio: 1800,
        stock: 15,
        stockCritico: 5,
        categoria: "Frutas",
        disponible: true,
        imagen: "img/naranjas.jpg"
    },
    {
        id: 3,
        codigo: "VER001",
        nombre: "Lechugas",
        descripcion: "Lechugas frescas cosechadas recientemente.",
        precio: 1000,
        stock: 10,
        stockCritico: 3,
        categoria: "Verduras",
        disponible: true,
        imagen: "img/lechugas.jpg"
    },
    {
        id: 4,
        codigo: "VER002",
        nombre: "Tomates",
        descripcion: "Tomates frescos ideales para ensaladas.",
        precio: 2000,
        stock: 12,
        stockCritico: 4,
        categoria: "Verduras",
        disponible: true,
        imagen: "img/tomates.jpg"
    },
    {
        id: 5,
        codigo: "NAT001",
        nombre: "Miel natural",
        descripcion: "Miel natural producida en campos chilenos.",
        precio: 4500,
        stock: 8,
        stockCritico: 2,
        categoria: "Productos naturales",
        disponible: true,
        imagen: "img/miel.jpg"
    }
];

const productosGuardados = localStorage.getItem("productos");
const productosGuardadosParseados = productosGuardados
    ? JSON.parse(productosGuardados)
    : [];

const productos = productosGuardadosParseados.length > 0
    ? productosGuardadosParseados.map(function(producto) {
        const productoInicial = productosIniciales.find(function(item) {
            return item.id === producto.id;
        });

        return {
            ...productoInicial,
            ...producto
        };
    })
    : productosIniciales;

localStorage.setItem("productos", JSON.stringify(productos));

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto, cantidad) {
    const productoExistente = carrito.find(function(item) {
        return item.id === producto.id;
    });

    const cantidadActual = productoExistente
        ? productoExistente.cantidad
        : 0;

    if (cantidadActual + cantidad > producto.stock) {
        alert("No puedes agregar más unidades que el stock disponible.");
        return;
    }

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad
        });
    }

    guardarCarrito();
    alert("Producto agregado al carrito.");
}

function crearTarjetaProducto(producto, mostrarInformacionCompleta) {
    const elemento = document.createElement("article");
    elemento.dataset.categoria = producto.categoria;

    const estadoDisponible = producto.stock > 0 && producto.disponible;

    elemento.innerHTML = `
        <img src="${producto.imagen || "img/producto-generico.jpg"}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        ${mostrarInformacionCompleta ? `<p>${producto.descripcion}</p>` : ""}
        <p>Precio: $${producto.precio}</p>
        <p class="${estadoDisponible ? "disponible" : "agotado"}">
            ${estadoDisponible ? "Disponible" : "Agotado"}
        </p>
        <label for="cantidad-${producto.id}">Cantidad:</label>
        <input
            type="number"
            id="cantidad-${producto.id}"
            min="1"
            max="${producto.stock}"
            value="1"
            ${!estadoDisponible ? "disabled" : ""}
        >
        <button ${!estadoDisponible ? "disabled" : ""}>
            Agregar al carrito
        </button>
        <a href="detalle-producto.html?id=${producto.id}">
            Ver detalle
        </a>
    `;

    const boton = elemento.querySelector("button");
    const inputCantidad = elemento.querySelector("input");

    if (boton) {
        boton.addEventListener("click", function() {
            const cantidad = Number(inputCantidad.value);

            if (cantidad < 1 || cantidad > producto.stock) {
                alert("Ingresa una cantidad válida.");
                return;
            }

            agregarAlCarrito(producto, cantidad);
        });
    }

    return elemento;
}

function mostrarProductos() {
    const contenedor = document.getElementById("contenedor-productos");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    const esInicio = window.location.pathname.endsWith("index.html")
        || window.location.pathname.endsWith("/");

    if (esInicio) {
        productos.slice(0, 3).forEach(function(producto) {
            const tarjeta = crearTarjetaProducto(producto, false);
            contenedor.appendChild(tarjeta);
        });

        return;
    }

    const categorias = [];

    productos.forEach(function(producto) {
        if (!categorias.includes(producto.categoria)) {
            categorias.push(producto.categoria);
        }
    });

    categorias.forEach(function(categoria) {
        const seccion = document.createElement("section");
        const titulo = document.createElement("h2");
        const contenedorCategoria = document.createElement("div");

        titulo.textContent = categoria;
        contenedorCategoria.className = "grupo-categoria";

        productos
            .filter(function(producto) {
                return producto.categoria === categoria;
            })
            .forEach(function(producto) {
                const tarjeta = crearTarjetaProducto(producto, true);
                contenedorCategoria.appendChild(tarjeta);
            });

        seccion.appendChild(titulo);
        seccion.appendChild(contenedorCategoria);
        contenedor.appendChild(seccion);
    });
}

mostrarProductos();