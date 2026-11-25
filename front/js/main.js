import { obtenerJuegos, obtenerDetalle } from "./api.js"
import { URL_BACK, pedir } from "./script.js"
import { mensaje, renderJuegos, mostrarJuegoSorpresa, mostrarLanzamiento, renderDetalle } from "./ui.js"


// juego sorpresa

const imgSorpresa = document.querySelector("#sorpresa-imagen")
const divSorpresaPlaceholder = document.querySelector("#sorpresa-placeholder")
const hSorpresaTitulo = document.querySelector("#sorpresa-titulo")
const pSorpresaDescripcion = document.querySelector("#sorpresa-descripcion")
const divSorpresaEtiquetas = document.querySelector("#sorpresa-etiquetas")


// destacados

const divEstadoDestacados = document.querySelector("#estado-destacados")
const divListaDestacados = document.querySelector("#lista-destacados")


// lanzamientos

const btnAnterior = document.querySelector("#anterior")
const btnSiguiente = document.querySelector("#siguiente")
const divEstadoLanzamientos = document.querySelector("#estado-lanzamientos")
const divContenidoLanzamiento = document.querySelector("#contenido-lanzamiento")
const pContadorLanzamientos = document.querySelector("#contador-lanzamientos")
const btnReintentarLanzamientos = document.querySelector("#reintentar-lanzamientos")


// filtros

const formFiltros = document.querySelector("#form-filtros")
const inpBusqueda = document.querySelector("#busqueda")
const selPlataforma = document.querySelector("#plataforma")
const selCategoria = document.querySelector("#categoria")
const selOrden = document.querySelector("#orden")
const btnAplicarFiltros = document.querySelector("#aplicar-filtros")
const btnLimpiarFiltros = document.querySelector("#limpiar-filtros")
const pCantidadJuegos = document.querySelector("#cantidad-juegos")
const divEstadoCatalogo = document.querySelector("#estado-catalogo")
const divListaCatalogo = document.querySelector("#lista-catalogo")
const btnReintentarCatalogo = document.querySelector("#reintentar-catalogo")


// detalle

const divDetalleModal = document.querySelector("#detalle-modal")
const divModalFuera = document.querySelector("#modal-backdrop")
const btnCerrarDetalle = document.querySelector("#cerrar-detalle")
const divEstadoDetalle = document.querySelector("#estado-detalle")
const divContenidoDetalle = document.querySelector("#contenido-detalle")
const btnReintentarDetalle = document.querySelector("#reintentar-detalle")


// variables filtros

let searchText = ""
let selectedPlatform = ""
let selectedCategory = ""
let sortOrder = ""

let selectedGameId = null
let juegoSeleccionado = null

let isLoading = false
let errorMessage = null

let juegosGenerales = []
let juegosCatalogo = []
let juegosRecientes = []

let posicionLanzamiento = 0


// catálogo

function mostrarCatalogo(juegos) {
    renderJuegos(divListaCatalogo, juegos)

    pCantidadJuegos.textContent = `Mostrando ${juegos.length} juegos`

    if (juegos.length === 0) {
        mensaje(
            divEstadoCatalogo,
            "No se encontraron videojuegos que coincidan con los criterios seleccionados."
        )
    } else {
        mensaje(divEstadoCatalogo, "")
    }
}


// búsqueda x nombre

function buscarPorNombre() {
    searchText = inpBusqueda.value.trim().toLowerCase()

    if (searchText === "") {
        mostrarCatalogo(juegosCatalogo)
        return
    }

    const resultados = juegosCatalogo.filter(juego => {
        return juego.title.toLowerCase().includes(searchText)
    })

    mostrarCatalogo(resultados)
}


// filtros

async function cargarCatalogoConFiltros() {
    selectedPlatform = selPlataforma.value
    selectedCategory = selCategoria.value
    sortOrder = selOrden.value

    if (
        selectedPlatform === "" &&
        selectedCategory === "" &&
        sortOrder === ""
    ) {
        juegosCatalogo = juegosGenerales
        buscarPorNombre()
        return
    }

    isLoading = true
    errorMessage = null

    btnAplicarFiltros.disabled = true
    btnReintentarCatalogo.style.display = "none"

    mensaje(divEstadoCatalogo, "Aplicando filtros...")

    try {
        juegosCatalogo = await obtenerJuegos(
            selectedPlatform,
            selectedCategory,
            sortOrder
        )

        isLoading = false
        btnAplicarFiltros.disabled = false

        buscarPorNombre()

    } catch (error) {
        isLoading = false
        errorMessage = error.message
        btnAplicarFiltros.disabled = false

        mensaje(divEstadoCatalogo, errorMessage, true)
        btnReintentarCatalogo.style.display = "inline-flex"
    }
}


function limpiarFiltros() {
    formFiltros.reset()

    searchText = ""
    selectedPlatform = ""
    selectedCategory = ""
    sortOrder = ""

    juegosCatalogo = juegosGenerales
    btnReintentarCatalogo.style.display = "none"

    mostrarCatalogo(juegosCatalogo)
}


// juego aleatorio

function mostrarSorpresa() {
    if (juegosGenerales.length === 0) return

    const indice = Math.floor(Math.random() * juegosGenerales.length)
    const juego = juegosGenerales[indice]

    mostrarJuegoSorpresa(
        imgSorpresa,
        divSorpresaPlaceholder,
        hSorpresaTitulo,
        pSorpresaDescripcion,
        divSorpresaEtiquetas,
        juego
    )
}


// destacados

function mostrarDestacados() {
    const destacados = juegosGenerales.filter((juego, indice) => {
        return indice < 6
    })

    renderJuegos(divListaDestacados, destacados)

    if (destacados.length === 0) {
        mensaje(
            divEstadoDestacados,
            "No hay juegos destacados disponibles."
        )
    } else {
        mensaje(divEstadoDestacados, "")
    }
}


// lanzamientos

function actualizarCarrusel() {
    if (juegosRecientes.length === 0) return

    mostrarLanzamiento(
        divContenidoLanzamiento,
        pContadorLanzamientos,
        juegosRecientes[posicionLanzamiento],
        posicionLanzamiento,
        juegosRecientes.length
    )
}


function lanzamientoAnterior() {
    if (juegosRecientes.length === 0) return

    posicionLanzamiento--

    if (posicionLanzamiento < 0) {
        posicionLanzamiento = juegosRecientes.length - 1
    }

    actualizarCarrusel()
}


function lanzamientoSiguiente() {
    if (juegosRecientes.length === 0) return

    posicionLanzamiento++

    if (posicionLanzamiento >= juegosRecientes.length) {
        posicionLanzamiento = 0
    }

    actualizarCarrusel()
}


async function cargarLanzamientos() {
    btnReintentarLanzamientos.style.display = "none"

    mensaje(
        divEstadoLanzamientos,
        "Cargando últimos lanzamientos..."
    )

    try {
        const juegos = await obtenerJuegos("", "", "release-date")

        juegosRecientes = juegos.filter((juego, indice) => {
            return indice < 10
        })

        posicionLanzamiento = 0

        if (juegosRecientes.length === 0) {
            mensaje(
                divEstadoLanzamientos,
                "No hay lanzamientos disponibles."
            )

            btnAnterior.disabled = true
            btnSiguiente.disabled = true

            return
        }

        mensaje(divEstadoLanzamientos, "")

        btnAnterior.disabled = false
        btnSiguiente.disabled = false

        actualizarCarrusel()

    } catch (error) {
        errorMessage = error.message

        mensaje(
            divEstadoLanzamientos,
            errorMessage,
            true
        )

        btnReintentarLanzamientos.style.display = "inline-flex"
    }
}


// detalle videojuegos

function abrirModal() {
    divDetalleModal.style.display = "grid"
    document.body.classList.add("modal-open")
}


function cerrarModal() {
    divDetalleModal.style.display = "none"
    document.body.classList.remove("modal-open")

    divContenidoDetalle.innerHTML = ""
    mensaje(divEstadoDetalle, "")

    btnReintentarDetalle.style.display = "none"
}


async function cargarDetalle(id) {
    selectedGameId = Number(id)

    isLoading = true
    errorMessage = null

    abrirModal()

    divContenidoDetalle.innerHTML = ""
    btnReintentarDetalle.style.display = "none"

    mensaje(
        divEstadoDetalle,
        "Cargando detalle del videojuego..."
    )

    try {
        const juego = await obtenerDetalle(selectedGameId)

        juegoSeleccionado = juego

        renderDetalle(
            divContenidoDetalle,
            juego
        )

        mensaje(divEstadoDetalle, "")

        isLoading = false

    } catch (error) {
        isLoading = false
        errorMessage = error.message

        mensaje(
            divEstadoDetalle,
            errorMessage,
            true
        )

        btnReintentarDetalle.style.display = "inline-flex"
    }
}


// agregar a biblioteca

async function agregarJuegoBiblioteca() {
    const token = localStorage.getItem("token")

    if (!token) {
        window.location.href = "login.html"
        return
    }

    if (!juegoSeleccionado) return

    try {
        await pedir(`${URL_BACK}/juegos`, {
            method: "POST",

            body: JSON.stringify({
                juegoId: juegoSeleccionado.id,
                titulo: juegoSeleccionado.title,
                imagen: juegoSeleccionado.thumbnail,
                genero: juegoSeleccionado.genre,
                plataforma: juegoSeleccionado.platform
            })
        })

        alert("Juego agregado a tu biblioteca")

    } catch (error) {
        alert(error.message)
    }
}


// carga inicial

async function iniciar() {
    isLoading = true
    errorMessage = null

    btnReintentarCatalogo.style.display = "none"

    mensaje(
        divEstadoCatalogo,
        "Cargando videojuegos..."
    )

    mensaje(
        divEstadoDestacados,
        "Cargando juegos destacados..."
    )

    try {
        juegosGenerales = await obtenerJuegos()
        juegosCatalogo = juegosGenerales

        mostrarSorpresa()
        mostrarDestacados()
        mostrarCatalogo(juegosCatalogo)

        isLoading = false

    } catch (error) {
        isLoading = false
        errorMessage = error.message

        mensaje(
            divEstadoCatalogo,
            errorMessage,
            true
        )

        mensaje(
            divEstadoDestacados,
            errorMessage,
            true
        )

        divSorpresaPlaceholder.textContent =
            "No se pudo cargar el juego sorpresa."

        btnReintentarCatalogo.style.display = "inline-flex"
    }

    await cargarLanzamientos()
}


// eventos filtros

formFiltros.addEventListener("submit", async evento => {
    evento.preventDefault()
    await cargarCatalogoConFiltros()
})


inpBusqueda.addEventListener("input", () => {
    buscarPorNombre()
})


btnLimpiarFiltros.addEventListener("click", () => {
    limpiarFiltros()
})


btnReintentarCatalogo.addEventListener("click", async () => {
    if (juegosGenerales.length === 0) {
        await iniciar()
    } else {
        await cargarCatalogoConFiltros()
    }
})


// eventos lanzamientos

btnAnterior.addEventListener("click", () => {
    lanzamientoAnterior()
})


btnSiguiente.addEventListener("click", () => {
    lanzamientoSiguiente()
})


btnReintentarLanzamientos.addEventListener("click", async () => {
    await cargarLanzamientos()
})


// eventos detalle

divListaDestacados.addEventListener("click", evento => {
    if (!evento.target.classList.contains("btnDetalle")) return

    cargarDetalle(evento.target.dataset.id)
})


divListaCatalogo.addEventListener("click", evento => {
    if (!evento.target.classList.contains("btnDetalle")) return

    cargarDetalle(evento.target.dataset.id)
})


divContenidoLanzamiento.addEventListener("click", evento => {
    if (!evento.target.classList.contains("btnDetalle")) return

    cargarDetalle(evento.target.dataset.id)
})


divContenidoDetalle.addEventListener("click", async evento => {
    if (!evento.target.classList.contains("btnAgregar")) return

    await agregarJuegoBiblioteca()
})


btnCerrarDetalle.addEventListener("click", () => {
    cerrarModal()
})


divModalFuera.addEventListener("click", () => {
    cerrarModal()
})


btnReintentarDetalle.addEventListener("click", async () => {
    if (selectedGameId !== null) {
        await cargarDetalle(selectedGameId)
    }
})


// inicio

iniciar()