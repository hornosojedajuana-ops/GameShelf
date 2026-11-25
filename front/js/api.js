const BASE_URL = "https://www.freetogame.com/api"

// GET /games

export async function obtenerJuegos(plataforma = "", categoria = "", orden = "") {
    let url = `${BASE_URL}/games`
    let separador = "?"

    if (plataforma !== "") {
        url += `${separador}platform=${plataforma}`
        separador = "&"
    }

    if (categoria !== "") {
        url += `${separador}category=${categoria}`
        separador = "&"
    }

    if (orden !== "") {
        url += `${separador}sort-by=${orden}`
    }

    const respuesta = await fetch(url)

    if (!respuesta.ok) {
        throw new Error("No pudimos cargar los videojuegos")
    }

    const datos = await respuesta.json()
    return datos
}

// GET /game?id={id}

export async function obtenerDetalle(id) {
    const respuesta = await fetch(`${BASE_URL}/game?id=${id}`)

    if (!respuesta.ok) {
        throw new Error("No pudimos cargar el detalle del videojuego")
    }

    const datos = await respuesta.json()
    return datos
}
