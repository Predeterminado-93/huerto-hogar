const productos = [
    {
        id: 1,
        nombre: "Manzanas Fuji",
        precio: 1700,
        categoria: "Frutas Frescas",
        descripcion: "Manzanas frescas de textura crujiente y sabor dulce.",
        disponible: true
    },
    {
        id: 2,
        nombre: "Pera asiática",
        precio: 1500,
        categoria: "Frutas Frescas",
        descripcion: "Pera asiática fresca, jugosa y de sabor suave.",
        disponible: true
    },
    {
        id: 3,
        nombre: "Palta Hass Chilena",
        precio: 5500,
        categoria: "Verduras orgánicas",
        descripcion: "Palta Hass chilena de excelente calidad y textura cremosa.",
        disponible: true
    },
    {
        id: 4,
        nombre: "Tomate Limachino",
        precio: 1500,
        categoria: "Verduras orgánicas",
        descripcion: "Tomate Limachino fresco, ideal para ensaladas y preparaciones.",
        disponible: true
    },
    {
        id: 5,
        nombre: "Mantequilla",
        precio: 2000,
        categoria: "Lácteos",
        descripcion: "Mantequilla de textura suave y sabor tradicional.",
        disponible: true
    },
    {
        id: 6,
        nombre: "Leche Entera",
        precio: 1050,
        categoria: "Lácteos",
        descripcion: "Leche entera fresca para consumo diario.",
        disponible: true
    },
    {
        id: 7,
        nombre: "Almendras",
        precio: 12500,
        categoria: "Otros productos",
        descripcion: "Almendras seleccionadas, ideales para una alimentación saludable.",
        disponible: true
    },
    {
        id: 8,
        nombre: "Cacao en polvo",
        precio: 4500,
        categoria: "Otros productos",
        descripcion: "Cacao en polvo para repostería y preparaciones caseras.",
        disponible: true
    },
    {
        id: 9,
        nombre: "Huevos",
        precio: 12500,
        categoria: "Otros productos",
        descripcion: "Huevos frescos para distintas preparaciones.",
        disponible: true
    }
];

const carritoGuardado = localStorage.getItem("carrito");
const carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

const contenedor = document.getElementById("contenedor-productos");

function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(function(item) {
        return item.id === producto.id;
    });

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert("Producto agregado al carrito.");
}

if (contenedor) {
    productos.forEach(function(producto) {
        const tarjeta = document.createElement("article");

        let estado;
        let claseEstado;
        let boton;

        if (producto.disponible) {
            estado = "Disponible";
            claseEstado = "disponible";
            boton = `<button class="boton-carrito">Agregar al carrito</button>`;
        } else {
            estado = "Agotado";
            claseEstado = "agotado";
            boton = `<button disabled>Producto agotado</button>`;
        }

        tarjeta.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Categoría: ${producto.categoria}</p>
            <p class="${claseEstado}">Estado: ${estado}</p>
            <a href="detalle-producto.html?id=${producto.id}">Ver detalle</a>
            ${boton}
        `;

        contenedor.appendChild(tarjeta);

        if (producto.disponible) {
            const botonCarrito = tarjeta.querySelector(".boton-carrito");

            botonCarrito.addEventListener("click", function() {
                agregarAlCarrito(producto);
            });
        }
    });
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