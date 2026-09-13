const productosIniciales = [
    { id: 1, codigo: "FH001", nombre: "Manzanas Fuji", precio: 1700, categoria: "Frutas Frescas", descripcion: "Manzanas frescas de textura crujiente y sabor dulce.", stock: 20, stockCritico: 5, disponible: true, imagen: "img/manzanas.jpg" },
    { id: 2, codigo: "FH002", nombre: "Pera asiática", precio: 1500, categoria: "Frutas Frescas", descripcion: "Pera asiática fresca, jugosa y de sabor suave.", stock: 15, stockCritico: 5, disponible: true, imagen: "img/peras.jpg" },
    { id: 3, codigo: "VH001", nombre: "Palta Hass Chilena", precio: 5500, categoria: "Verduras Orgánicas", descripcion: "Palta Hass chilena de excelente calidad y textura cremosa.", stock: 12, stockCritico: 4, disponible: true, imagen: "img/paltas.jpg" },
    { id: 4, codigo: "VH002", nombre: "Tomate Limachino", precio: 1500, categoria: "Verduras Orgánicas", descripcion: "Tomate Limachino fresco, ideal para ensaladas y preparaciones.", stock: 18, stockCritico: 5, disponible: true, imagen: "img/tomates.jpg" },
    { id: 5, codigo: "LA001", nombre: "Mantequilla", precio: 2000, categoria: "Productos Lácteos", descripcion: "Mantequilla de textura suave y sabor tradicional.", stock: 10, stockCritico: 3, disponible: true, imagen: "img/mantequilla.jpg" },
    { id: 6, codigo: "LA002", nombre: "Leche Entera", precio: 1050, categoria: "Productos Lácteos", descripcion: "Leche entera fresca para consumo diario.", stock: 25, stockCritico: 5, disponible: true, imagen: "img/leche.jpg" },
    { id: 7, codigo: "OP001", nombre: "Almendras", precio: 12500, categoria: "Productos Orgánicos", descripcion: "Almendras seleccionadas, ideales para una alimentación saludable.", stock: 8, stockCritico: 2, disponible: true, imagen: "img/almendras.jpg" },
    { id: 8, codigo: "OP002", nombre: "Cacao en polvo", precio: 4500, categoria: "Productos Orgánicos", descripcion: "Cacao en polvo para repostería y preparaciones caseras.", stock: 14, stockCritico: 4, disponible: true, imagen: "img/cacao.jpg" },
    { id: 9, codigo: "OP003", nombre: "Huevos", precio: 12500, categoria: "Productos Orgánicos", descripcion: "Huevos frescos para distintas preparaciones.", stock: 30, stockCritico: 6, disponible: true, imagen: "img/huevos.jpg" }
];

const productosGuardados = localStorage.getItem("productos");
const productosGuardadosParseados = productosGuardados ? JSON.parse(productosGuardados) : [];

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

guardarProductos();

const carritoGuardado = localStorage.getItem("carrito");
const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

function guardarProductos() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function agregarAlCarrito(producto, cantidad) {
    const productoExistente = carrito.find(function(item) {
        return item.id === producto.id;
    });

    if (productoExistente) {
        if (productoExistente.cantidad + cantidad <= producto.stock) {
            productoExistente.cantidad += cantidad;
        } else {
            alert("La cantidad supera el stock disponible.");
            return;
        }
    } else {
        carrito.push({
            ...producto,
            cantidad: cantidad
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito.");
}

const contenedor = document.getElementById("contenedor-productos");
const buscador = document.getElementById("buscador-productos");
const filtroCategoria = document.getElementById("filtro-categoria");

function mostrarProductos(listaProductos) {
    contenedor.innerHTML = "";

    if (listaProductos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    const esInicio = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");

    listaProductos.forEach(function(producto) {
        const tarjeta = document.createElement("article");

        let estado;
        let claseEstado;
        let boton;

        if (producto.stock > 0 && producto.disponible) {
            estado = "Disponible";
            claseEstado = "disponible";
            boton = `
                <label for="cantidad-${producto.id}">Cantidad:</label>
                <input type="number" id="cantidad-${producto.id}" class="cantidad-catalogo" min="1" max="${producto.stock}" value="1">
                <button class="boton-carrito">Agregar al carrito</button>
            `;
        } else {
            estado = "Agotado";
            claseEstado = "agotado";
            boton = `<button disabled>Producto agotado</button>`;
        }

        if (esInicio) {
            tarjeta.innerHTML = `
                <img src="${producto.imagen || "img/producto-generico.jpg"}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p class="${claseEstado}">Estado: ${estado}</p>
                ${boton}
                <a href="detalle-producto.html?id=${producto.id}">Ver detalle</a>
            `;
        } else {
            tarjeta.innerHTML = `
                <img src="${producto.imagen || "img/producto-generico.jpg"}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio}</p>
                <p>Categoría: ${producto.categoria}</p>
                <p class="${claseEstado}">Estado: ${estado}</p>
                ${boton}
                <a href="detalle-producto.html?id=${producto.id}">Ver detalle</a>
            `;
        }

        contenedor.appendChild(tarjeta);

        if (producto.stock > 0 && producto.disponible) {
            const botonCarrito = tarjeta.querySelector(".boton-carrito");
            const cantidadCatalogo = tarjeta.querySelector(".cantidad-catalogo");

            botonCarrito.addEventListener("click", function() {
                const cantidad = Number(cantidadCatalogo.value);

                if (cantidad < 1 || cantidad > producto.stock) {
                    alert("Selecciona una cantidad válida.");
                    return;
                }

                agregarAlCarrito(producto, cantidad);
            });
        }
    });
}

function filtrarProductos() {
    const textoBusqueda = buscador ? buscador.value.toLowerCase() : "";
    const categoriaSeleccionada = filtroCategoria ? filtroCategoria.value : "";

    const productosFiltrados = productos.filter(function(producto) {
        const coincideNombre = producto.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCategoria = categoriaSeleccionada === "" || producto.categoria === categoriaSeleccionada;

        return coincideNombre && coincideCategoria;
    });

    mostrarProductos(productosFiltrados);
}

if (contenedor) {
    const esInicio = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");

    if (esInicio) {
        mostrarProductos(productos.slice(0, 3));
    } else {
        mostrarProductos(productos);
    }

    if (buscador) {
        buscador.addEventListener("input", filtrarProductos);
    }

    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", filtrarProductos);
    }
}

const mensajeSesion = document.getElementById("mensaje-sesion");

if (mensajeSesion) {
    const sesionActiva = localStorage.getItem("sesionActiva");

    if (sesionActiva === "true") {
        mensajeSesion.textContent = "Has iniciado sesión correctamente.";
    } else {
        mensajeSesion.textContent = "No has iniciado sesión.";
    }
}