export const URL_BACK = "http://localhost:3000"


// token

function guardarToken(token) {
    localStorage.setItem("token", token)
}

function leerToken() {
    return localStorage.getItem("token")
}

function borrarToken() {
    localStorage.removeItem("token")
}


// pedir al backend

export async function pedir(url, opciones = {}) {
    const token = leerToken()

    const headers = {
        "Content-Type": "application/json",
        ...opciones.headers
    }

    if (token) {
        headers.Authorization = "Bearer " + token
    }

    const respuesta = await fetch(url, {
        ...opciones,
        headers: headers
    })

    if (respuesta.status === 401 && token) {
        borrarToken()
        window.location.href = "login.html"

        throw new Error("Se venció tu sesión. Volvé a entrar.")
    }

    if (!respuesta.ok) {
        const tipoContenido = respuesta.headers.get("content-type")

        if (tipoContenido && tipoContenido.includes("application/json")) {
            const datos = await respuesta.json()

            throw new Error(
                datos.mensaje || "Ocurrió un error"
            )
        }

        throw new Error(
            "El servidor no respondió correctamente. Intentá de nuevo."
        )
    }

    const tipoContenido = respuesta.headers.get("content-type")

    if (!tipoContenido || !tipoContenido.includes("application/json")) {
        throw new Error(
            "El servidor devolvió una respuesta no válida."
        )
    }

    return await respuesta.json()
}


// usuario y sesión

const authGuest = document.querySelector("#auth-guest")
const authUser = document.querySelector("#auth-user")
const nombreUsuario = document.querySelector("#nombre-usuario")

const btnLogin = document.querySelector("#btn-login")
const btnRegister = document.querySelector("#btn-register")
const btnLogout = document.querySelector("#btn-logout")


async function mostrarUsuario() {
    if (!authGuest || !authUser) return

    const token = leerToken()

    if (!token) {
        authGuest.style.display = "flex"
        authUser.style.display = "none"
        return
    }

    try {
        const usuario = await pedir(`${URL_BACK}/usuarios/yo`)

        authGuest.style.display = "none"
        authUser.style.display = "flex"

        if (nombreUsuario) {
            nombreUsuario.textContent = usuario.nombre
        }

    } catch (error) {
        authGuest.style.display = "flex"
        authUser.style.display = "none"
    }
}


if (btnLogin) {
    btnLogin.addEventListener("click", function () {
        window.location.href = "login.html"
    })
}


if (btnRegister) {
    btnRegister.addEventListener("click", function () {
        window.location.href = "registro.html"
    })
}


if (btnLogout) {
    btnLogout.addEventListener("click", function () {
        borrarToken()
        window.location.href = "index.html"
    })
}


// login

const formLogin = document.querySelector("#form-login")
const mensajeLogin = document.querySelector("#mensaje-login")


if (formLogin) {
    formLogin.addEventListener("submit", async function (evento) {
        evento.preventDefault()

        const email = document.querySelector("#email").value
        const password = document.querySelector("#password").value

        try {
            const resultado = await pedir(`${URL_BACK}/usuarios/login`, {
                method: "POST",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            guardarToken(resultado.token)
            window.location.href = "index.html"

        } catch (error) {
            if (mensajeLogin) {
                mensajeLogin.textContent = error.message
            }
        }
    })
}


// registro

const formRegistro = document.querySelector("#form-registro")
const mensajeRegistro = document.querySelector("#mensaje-registro")


if (formRegistro) {
    formRegistro.addEventListener("submit", async function (evento) {
        evento.preventDefault()

        const nombre = document.querySelector("#nombre").value
        const email = document.querySelector("#email").value
        const password = document.querySelector("#password").value

        try {
            await pedir(`${URL_BACK}/usuarios/registro`, {
                method: "POST",

                body: JSON.stringify({
                    nombre: nombre,
                    email: email,
                    password: password
                })
            })

            const resultado = await pedir(`${URL_BACK}/usuarios/login`, {
                method: "POST",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            guardarToken(resultado.token)
            window.location.href = "index.html"

        } catch (error) {
            if (mensajeRegistro) {
                mensajeRegistro.textContent = error.message
            }
        }
    })
}


// inicio

mostrarUsuario()