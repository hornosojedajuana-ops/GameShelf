import { URL_BACK, pedir } from "./script.js"

const token = localStorage.getItem("token")

if (!token) window.location.href = "login.html"


// ELEMENTOS

const listaBiblioteca = document.querySelector("#lista-biblioteca")
const bibliotecaVacia = document.querySelector("#biblioteca-vacia")
const estadoBiblioteca = document.querySelector("#estado-biblioteca")

const cantidadTotal = document.querySelector("#cantidad-total")
const cantidadPendientes = document.querySelector("#cantidad-pendientes")
const cantidadJugando = document.querySelector("#cantidad-jugando")
const cantidadCompletados = document.querySelector("#cantidad-completados")

const formBiblioteca = document.querySelector("#form-biblioteca")
const buscarBiblioteca = document.querySelector("#buscar-biblioteca")
const estadoFiltro = document.querySelector("#estado-biblioteca-filtro")
const ordenBiblioteca = document.querySelector("#orden-biblioteca")
const limpiarBiblioteca = document.querySelector("#limpiar-biblioteca")


// Recomendador de juegos

const btnElegirJuego = document.querySelector("#elegir-juego")
const btnElegirOtro = document.querySelector("#elegir-otro")
const resultadoJuego = document.querySelector("#resultado-juego")

const botonesMood = document.querySelectorAll(".mood-chip")
const recomendadorGenero = document.querySelector("#recomendador-genero")
const recomendadorPlataforma = document.querySelector("#recomendador-plataforma")


// Editar estados

const editarModal = document.querySelector("#editar-modal")
const editarBackdrop = document.querySelector("#editar-backdrop")
const cerrarEditar = document.querySelector("#cerrar-editar")
const editarJuegoInfo = document.querySelector("#editar-juego-info")

const formEditarJuego = document.querySelector("#form-editar-juego")
const editarEstado = document.querySelector("#editar-estado")
const editarNota = document.querySelector("#editar-nota")
const mensajeEditar = document.querySelector("#mensaje-editar")
const btnEliminarJuego = document.querySelector("#eliminar-juego")


// Variables

let juegosBiblioteca = []
let juegoSeleccionado = null
let moodSeleccionado = "accion"
let ultimoJuegoRecomendado = null


// Cargar biblioteca

async function cargarJuegos() {
    estadoBiblioteca.style.display = "block"
    estadoBiblioteca.textContent = "Cargando tu biblioteca..."

    try {
        juegosBiblioteca = await pedir(`${URL_BACK}/juegos`)

        actualizarContadores()
        cargarOpcionesRecomendador()
        mostrarJuegos(juegosBiblioteca)

    } catch (error) {
        estadoBiblioteca.textContent = error.message
        estadoBiblioteca.className = "status error"
    }
}


// Mostrar juego

function mostrarJuegos(juegos) {
    listaBiblioteca.innerHTML = ""

    if (juegos.length === 0) {
        estadoBiblioteca.style.display = "none"
        bibliotecaVacia.style.display = "flex"
        return
    }

    bibliotecaVacia.style.display = "none"
    estadoBiblioteca.style.display = "none"

    juegos.forEach(function (juego) {
        const tarjeta = document.createElement("article")

        tarjeta.className = "game-card"

        tarjeta.innerHTML = `
            <div class="game-cover">
                <img src="${juego.imagen}" alt="Portada de ${juego.titulo}">
            </div>

            <div class="game-card-body">
                <div class="library-card-top">
                    <span class="library-platform">
                        ${juego.plataforma}
                    </span>

                    <span class="library-status status-${juego.estado.replaceAll(" ", "-")}">
                        ${juego.estado}
                    </span>
                </div>

                <h3>${juego.titulo}</h3>

                <p class="card-description">
                    ${juego.nota ? juego.nota : "Sin notas todavía."}
                </p>

                <div class="card-footer">
                    <button
                        class="btn btn-secondary btnEditarJuego"
                        type="button"
                        data-id="${juego._id}"
                    >
                        Cambiar estado
                    </button>
                </div>
            </div>
        `

        listaBiblioteca.appendChild(tarjeta)
    })
}


// Contador de juegos

function actualizarContadores() {
    cantidadTotal.textContent = juegosBiblioteca.length

    cantidadPendientes.textContent = juegosBiblioteca.filter(function (juego) {
        return juego.estado === "quiero jugar"
    }).length

    cantidadJugando.textContent = juegosBiblioteca.filter(function (juego) {
        return juego.estado === "jugando"
    }).length

    cantidadCompletados.textContent = juegosBiblioteca.filter(function (juego) {
        return juego.estado === "terminado"
    }).length
}


// Filtros

function aplicarFiltros() {
    const texto = buscarBiblioteca.value.trim().toLowerCase()
    const estado = estadoFiltro.value

    let juegosFiltrados = juegosBiblioteca.filter(function (juego) {
        const coincideTexto = juego.titulo.toLowerCase().includes(texto)
        const coincideEstado = estado === "" || juego.estado === estado

        return coincideTexto && coincideEstado
    })

    if (ordenBiblioteca.value === "titulo") {
        juegosFiltrados.sort(function (a, b) {
            return a.titulo.localeCompare(b.titulo)
        })
    } else {
        juegosFiltrados.sort(function (a, b) {
            return new Date(b.fechaDeCreacion) - new Date(a.fechaDeCreacion)
        })
    }

    mostrarJuegos(juegosFiltrados)
}


// Abrir pop-up edicion

function abrirEdicion(id) {
    juegoSeleccionado = juegosBiblioteca.find(function (juego) {
        return juego._id === id
    })

    if (!juegoSeleccionado) return

    editarJuegoInfo.innerHTML = `
        <img
            src="${juegoSeleccionado.imagen}"
            alt="Portada de ${juegoSeleccionado.titulo}"
        >

        <div class="game-card-body">
            <h3 id="editar-titulo">
                ${juegoSeleccionado.titulo}
            </h3>

            <div class="tags">
                <span class="tag">
                    ${juegoSeleccionado.genero}
                </span>

                <span class="tag">
                    ${juegoSeleccionado.plataforma}
                </span>
            </div>
        </div>
    `

    editarEstado.value = juegoSeleccionado.estado
    editarNota.value = juegoSeleccionado.nota || ""
    mensajeEditar.textContent = ""

    editarModal.style.display = "grid"
    document.body.classList.add("modal-open")
}


// Cerrar pop-up

function cerrarEdicion() {
    editarModal.style.display = "none"
    document.body.classList.remove("modal-open")

    juegoSeleccionado = null
    mensajeEditar.textContent = ""
}


// Guardar cambios

async function guardarCambios() {
    if (!juegoSeleccionado) return

    try {
        await pedir(`${URL_BACK}/juegos/${juegoSeleccionado._id}`, {
            method: "PUT",
            body: JSON.stringify({
                estado: editarEstado.value,
                nota: editarNota.value.trim()
            })
        })

        cerrarEdicion()
        await cargarJuegos()

    } catch (error) {
        mensajeEditar.textContent = error.message
    }
}


// Eliminar juego

async function eliminarJuego() {
    if (!juegoSeleccionado) return

    const confirmar = window.confirm(
        `¿Querés eliminar "${juegoSeleccionado.titulo}" de tu biblioteca?`
    )

    if (!confirmar) return

    try {
        await pedir(`${URL_BACK}/juegos/${juegoSeleccionado._id}`, {
            method: "DELETE"
        })

        cerrarEdicion()
        await cargarJuegos()

    } catch (error) {
        mensajeEditar.textContent = error.message
    }
}


// Filtros recomendador

function cargarOpcionesRecomendador() {
    const generoActual = recomendadorGenero.value
    const plataformaActual = recomendadorPlataforma.value

    const generos = [
        ...new Set(
            juegosBiblioteca.map(function (juego) {
                return juego.genero
            })
        )
    ].sort()

    const plataformas = [
        ...new Set(
            juegosBiblioteca.map(function (juego) {
                return juego.plataforma
            })
        )
    ].sort()

    recomendadorGenero.innerHTML = `
        <option value="">Todos</option>
    `

    generos.forEach(function (genero) {
        recomendadorGenero.innerHTML += `
            <option value="${genero}">
                ${genero}
            </option>
        `
    })

    recomendadorPlataforma.innerHTML = `
        <option value="">Todas</option>
    `

    plataformas.forEach(function (plataforma) {
        recomendadorPlataforma.innerHTML += `
            <option value="${plataforma}">
                ${plataforma}
            </option>
        `
    })

    if (generos.includes(generoActual)) {
        recomendadorGenero.value = generoActual
    }

    if (plataformas.includes(plataformaActual)) {
        recomendadorPlataforma.value = plataformaActual
    }
}


// Mood juego

function obtenerMoodJuego(juego) {
    const genero = juego.genero.toLowerCase()

    if (
        genero.includes("shooter") ||
        genero.includes("racing") ||
        genero.includes("fighting") ||
        genero.includes("battle") ||
        genero.includes("action") ||
        genero.includes("acción")
    ) {
        return "accion"
    }

    if (
        genero.includes("rpg") ||
        genero.includes("mmorpg") ||
        genero.includes("adventure") ||
        genero.includes("aventura")
    ) {
        return "historia"
    }

    if (
        genero.includes("strategy") ||
        genero.includes("estrategia") ||
        genero.includes("card") ||
        genero.includes("moba")
    ) {
        return "reto"
    }

    return "relajado"
}


function obtenerTextoMood() {
    if (moodSeleccionado === "accion") {
        return "acción rápida"
    }

    return moodSeleccionado
}


// Estado

function obtenerClaseEstado(estado) {
    if (estado === "jugando") {
        return "recommendation-status playing"
    }

    if (estado === "terminado") {
        return "recommendation-status finished"
    }

    return "recommendation-status pending"
}


// Juegos recomendados

function obtenerCandidatos() {
    const genero = recomendadorGenero.value
    const plataforma = recomendadorPlataforma.value

    let candidatos = juegosBiblioteca.filter(function (juego) {
        const coincideGenero = genero === "" || juego.genero === genero
        const coincidePlataforma = plataforma === "" || juego.plataforma === plataforma

        return coincideGenero && coincidePlataforma
    })

    const candidatosMood = candidatos.filter(function (juego) {
        return obtenerMoodJuego(juego) === moodSeleccionado
    })

    if (candidatosMood.length > 0) {
        candidatos = candidatosMood
    }

    return candidatos
}


// Elegir juego

function elegirJuego() {
    let candidatos = obtenerCandidatos()

    if (candidatos.length === 0) {
        resultadoJuego.innerHTML = `
            <div class="recommendation-empty">
                <span class="recommendation-kicker">
                    SIN RESULTADOS
                </span>

                <p>
                    No encontré juegos con esos filtros.
                    Probá cambiar el género, la plataforma
                    o tus ganas de jugar.
                </p>
            </div>
        `

        btnElegirOtro.disabled = true
        return
    }

    if (candidatos.length > 1 && ultimoJuegoRecomendado) {
        const sinRepetido = candidatos.filter(function (juego) {
            return juego._id !== ultimoJuegoRecomendado
        })

        if (sinRepetido.length > 0) {
            candidatos = sinRepetido
        }
    }

    const indice = Math.floor(Math.random() * candidatos.length)
    const juego = candidatos[indice]

    ultimoJuegoRecomendado = juego._id

    resultadoJuego.innerHTML = `
        <div class="recommended-game">

            <div class="recommendation-heading">
                <span class="recommendation-kicker">
                    TU PRÓXIMA PARTIDA
                </span>

                <span class="${obtenerClaseEstado(juego.estado)}">
                    ${juego.estado}
                </span>
            </div>

            <div class="recommended-game-layout">

                <img
                    src="${juego.imagen}"
                    alt="Portada de ${juego.titulo}"
                    class="recommended-game-image"
                >

                <div class="recommended-game-copy">
                    <h3>${juego.titulo}</h3>

                    <p>
                        Ideal para tus ganas de
                        ${obtenerTextoMood()}
                        en ${juego.plataforma}.
                    </p>

                    <span class="recommended-game-meta">
                        ${juego.plataforma} · ${juego.genero}
                    </span>
                </div>

            </div>

        </div>
    `

    btnElegirOtro.disabled = false
}


// Recargar

function reiniciarRecomendacion() {
    ultimoJuegoRecomendado = null
    btnElegirOtro.disabled = true

    resultadoJuego.innerHTML = `
        <div class="recommendation-empty">
            <span class="recommendation-kicker">
                TU PRÓXIMA PARTIDA
            </span>

            <p class="muted">
                Elegí tus preferencias y GameShelf
                te recomienda un juego.
            </p>
        </div>
    `
}


// Eventos recomendador

botonesMood.forEach(function (boton) {
    boton.addEventListener("click", function () {

        botonesMood.forEach(function (otroBoton) {
            otroBoton.classList.remove("active")
        })

        boton.classList.add("active")
        moodSeleccionado = boton.dataset.mood

        reiniciarRecomendacion()
    })
})


recomendadorGenero.addEventListener("change", function () {
    reiniciarRecomendacion()
})


recomendadorPlataforma.addEventListener("change", function () {
    reiniciarRecomendacion()
})


btnElegirJuego.addEventListener("click", function () {
    elegirJuego()
})


btnElegirOtro.addEventListener("click", function () {
    elegirJuego()
})


// Eventos biblioteca

listaBiblioteca.addEventListener("click", function (evento) {
    if (!evento.target.classList.contains("btnEditarJuego")) return

    abrirEdicion(evento.target.dataset.id)
})


formEditarJuego.addEventListener("submit", async function (evento) {
    evento.preventDefault()
    await guardarCambios()
})


btnEliminarJuego.addEventListener("click", async function () {
    await eliminarJuego()
})


cerrarEditar.addEventListener("click", function () {
    cerrarEdicion()
})


editarBackdrop.addEventListener("click", function () {
    cerrarEdicion()
})


formBiblioteca.addEventListener("submit", function (evento) {
    evento.preventDefault()
    aplicarFiltros()
})


buscarBiblioteca.addEventListener("input", function () {
    aplicarFiltros()
})


limpiarBiblioteca.addEventListener("click", function () {
    formBiblioteca.reset()
    mostrarJuegos(juegosBiblioteca)
})


// Inicio

cargarJuegos()