// Clase Producto:

class Producto{
    constructor(nombre, tipo, stock, precio, marca, imagen){
        this.nombre = nombre;
        this.tipo = tipo;
        this.precio = precio;
        this.marca = marca
        this.imagen = imagen;
    }
    
}

const sumaCarrito = (array) =>{
    let total = 0
    array.forEach((producto) =>{
        total += producto.precio
    })

    return total
}

class Usuario{
    constructor(usuario, password, email, ciudad, provincia){
        this.usuario = usuario;
        this.password = password;
        this.email = email
        this.ciudad = ciudad;
        this.provincia = provincia;
    }
}

// Creacion de arreglo para cargar objetos:
const arrayProductos = [];
let arrayCarrito = [];
let arrayUsuario = [];

// Prueba fetch JSON local para carga de productos con funcion asincronica:

async function mostrarProductos(){
    const productos = await fetch("../json/productos.json")
    const productosParse = await productos.json()
    productosParse.forEach((producto, index) => {
        
        productosMostrar.innerHTML += `
        <div class="card cardFlex m-3" id="producto${index}" style="width: 18rem;">
            <img src="../img/${producto.img}" class="card-img-top img-tarjeta-producto" alt="">
            <div class="card-body">
                <h5 class="card-subtitle mb-2 text-muted">${producto.nombre}</h5>
                <p class="card-text">Marca: ${producto.marca}</p>
                <p class="card-text">Tipo: ${producto.tipo}</p>
                <p class="card-text">Precio: $ ${producto.precio}</p>
                <button class="btn btn-primary btnVerProducto">Agregar al Carrito</button>
            </div>
        </div>
        
        `
    })

    productosParse.forEach((producto, index) => {
        document.getElementById(`producto${index}`).lastElementChild.lastElementChild.addEventListener("click", () => {
            let productoAgregar = producto
            arrayCarrito.push(productoAgregar)

            // Guardado en localStorage el array con producto agregado a carrito:
            localStorage.setItem("carrito", JSON.stringify(arrayCarrito))
    
            // Toastify para indicar que el producto se agrego al carro
            Toastify({
                text: "Producto agregado al Carrito",
                duration: 5000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "bottom", // `top` or `bottom`
                position: "left", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function(){} // Callback after click
                }).showToast();
        })
    });
    
}


let productosMostrar = document.getElementById("mostrarProducto")
let filtrados = document.getElementById("filtradoProductos")

if(productosMostrar){
    mostrarProductos()   
}

// Recuperacion de usuarios guardados en local storage(junto con la conversion a objetos par apoder manipular) o creacion de "usuarios" en localStorage 
// en caso de que se ingrese por primera vez:

localStorage.getItem("usuarios") ? arrayUsuario = JSON.parse(localStorage.getItem("usuarios")) : localStorage.setItem("usuarios", JSON.stringify(arrayUsuario))
localStorage.getItem("carrito") ? arrayCarrito = JSON.parse(localStorage.getItem("carrito")) : localStorage.setItem("carrito", JSON.stringify(arrayCarrito))

// Captura de elemento HTML para mostrar productos en HTML:
let productosTarjetas = document.getElementById('tarjetasProductos')

// Evento para guardar mediante formulario nuevos usuarios

let formularioUsuario = document.getElementById("formularioRegistro");
let mensajeRegistro = document.getElementById("registroExito")

if(formularioUsuario != null){
    formularioUsuario.addEventListener("submit", (event) =>{
        event.preventDefault()

        let usuario = document.getElementById("inputUsuario").value
        let password = document.getElementById("inputPassword").value
        let email = document.getElementById("inputEmail").value
        let ciudad = document.getElementById("inputCiudad").value
        let provincia = document.getElementById("inputProvincia").value
        
        if(usuario != "" && password != "" && email != "" && ciudad != "" && provincia != ""){
            const nuevoUsuario = new Usuario(usuario, password, email, ciudad, provincia)
            arrayUsuario.push(nuevoUsuario)
    
            // Guardado en localStorage el array con nuevo usuario registrado:
            localStorage.setItem("usuarios", JSON.stringify(arrayUsuario))
            formularioUsuario.reset()
    
            Swal.fire({
                icon: 'success',
                title: 'Felicitaciones !',
                text: 'Usted se ha registrado de manera exitosa',
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe ingresar datos válidos',
              })
        }

    })
}

// Evento para buscar en array de usuarios(recuperado del localStorage) y poder iniciar sesión(si el usuario y contraseña estan correctos)

let ingresoUsuario = document.getElementById("formularioIngreso")
let ingresoMensaje = document.getElementById("mensajeInicioSesion")

if(ingresoUsuario){
    ingresoUsuario.addEventListener("submit", (event) =>{
        event.preventDefault()
        let usuarioIngreso = document.getElementById("inputUsuarioIngreso").value
        let usuarioPassword = document.getElementById("inputPasswordIngreso").value

        let usuarioRegistrado = arrayUsuario.find(usuario => usuario.usuario == usuarioIngreso)

        if(usuarioRegistrado && usuarioRegistrado.password === usuarioPassword && usuarioRegistrado != "" && usuarioPassword != ""){
                // Desestructuracion objeto usuarioRegistrado
                let{usuario} = usuarioRegistrado
                Swal.fire({
                    icon: 'success',
                    title: `Bienvenido ${usuario}!`,
                    text: 'Usted ha iniciado sesion de manera exitosa',
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario o contraseña incorrectos',
                  })
            }
    })
}


let desplegarCarrito = document.getElementById("carrito")
let verCarrito = document.getElementById("cuerpoCarrito")
let finalizarCompraCarrito = document.getElementById("finalizarCompra")
let vaciarCarritoCompra = document.getElementById("vaciarCarrito")

// Funcion Mostrar Carrito

desplegarCarrito.addEventListener("click", () =>{

    let total = sumaCarrito(arrayCarrito)
    verCarrito.innerHTML = "" 

    arrayCarrito.forEach(producto => {
        
        verCarrito.innerHTML += `

        <div class="card mb-3" style="width: 100%";>
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="../img/${producto.img}" style="width: 30%" class="img-fluid rounded-start" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text"><small class="text-muted">$ ${producto.precio}</small></p>
                    </div>
                </div>
            </div>
        </div>

        `
    });

    verCarrito.innerHTML += `<span class="badge text-bg-success">Total: $ ${total}</span>` 
})

// Funcion Vaciar Carro

vaciarCarritoCompra.addEventListener("click", () =>{
    
    let total = 0

    // Limpieza de carrito una vez finalizada la compra
    arrayCarrito = []
    
    // Guardado en localStorage el array con producto agregado a carrito:
    localStorage.setItem("carrito", JSON.stringify(arrayCarrito))

    verCarrito.innerHTML = "" 
    verCarrito.innerHTML += `<span class="badge text-bg-success">Total: $ ${total}</span>` 
})

// Funcion Finalizar Compra

finalizarCompraCarrito.addEventListener("click", () =>{

    if(arrayCarrito.length != 0){

        let total = 0
        // Limpieza de carrito una vez finalizada la compra
        arrayCarrito = []
    
        // Guardado en localStorage el array con producto agregado a carrito:
        localStorage.setItem("carrito", JSON.stringify(arrayCarrito))
    
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Felicitaciones ! Has finalizado tu compra !',
            showConfirmButton: false,
            timer: 2500
          })
    
        verCarrito.innerHTML = "" 
        verCarrito.innerHTML += `<span class="badge text-bg-success">Total: $ ${total}</span>` 

    }else{
        // Advertencia de carro vacio si se quiere finalizar compra
        Swal.fire(
            'Carrito Vacio',
            'Para finalizar compra debe cargar productos al carrito',
            'question'
          )
    }
    
})