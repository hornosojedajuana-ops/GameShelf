import {
    buscarTodos,
    buscarPorId,
    buscarPorJuegoId,
    guardar,
    actualizar as actualizarRepository,
    eliminar as eliminarRepository
} from "../repositories/juegos.repository.js"

import { ESTADOS } from "../models/juego.js"


function errorCon(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status
    return error
}


function validar(datos) {
    const juegoId = datos.juegoId
    const titulo = datos.titulo
    const imagen = datos.imagen
    const genero = datos.genero
    const plataforma = datos.plataforma

    if (!juegoId || !titulo || !imagen || !genero || !plataforma) {
        throw errorCon(400, "Faltan datos obligatorios del juego")
    }

    return {
        juegoId: juegoId,
        titulo: titulo,
        imagen: imagen,
        genero: genero,
        plataforma: plataforma
    }
}


async function chequearJuegoLibre(juegoId, usuarioId) {
    const existente = await buscarPorJuegoId(
        juegoId,
        usuarioId
    )

    if (existente) {
        throw errorCon(409, "El juego ya está en tu biblioteca")
    }
}


function chequearQueSeaTuyo(juego, usuarioId) {
    if (
        juego.usuario.toString() !== usuarioId
    ) {
        throw errorCon(403, "Ese juego no es tuyo")
    }
}


function validarCambios(datos) {
    const limpios = {}

    if (datos.estado !== undefined) {

        if (!ESTADOS.includes(datos.estado)) {
            throw errorCon(400, "El estado tiene que ser uno de estos: " + ESTADOS.join(", "))
        }

        limpios.estado = datos.estado
    }

    if (datos.nota !== undefined) {
        limpios.nota = datos.nota
    }

    return limpios
}


export async function obtenerTodos(usuarioId) {
    return await buscarTodos(usuarioId)
}


export async function obtenerPorId(id, usuarioId) {
    const juego = await buscarPorId(id)

    if (!juego) {
        throw errorCon(404, "No existe un juego con id " + id)
    }

    chequearQueSeaTuyo(juego, usuarioId)

    return juego
}


export async function crear(datos, usuarioId) {
    const limpios = validar(datos)

    await chequearJuegoLibre(
        limpios.juegoId,
        usuarioId
    )

    const nuevo = {
        juegoId: limpios.juegoId,
        titulo: limpios.titulo,
        imagen: limpios.imagen,
        genero: limpios.genero,
        plataforma: limpios.plataforma,
        usuario: usuarioId
    }

    return await guardar(nuevo)
}


export async function actualizar(id, datos, usuarioId) {
    await obtenerPorId(
        id,
        usuarioId
    )

    const limpios = validarCambios(datos)

    return await actualizarRepository(
        id,
        limpios
    )
}


export async function eliminar(id, usuarioId) {
    await obtenerPorId(
        id,
        usuarioId
    )

    return await eliminarRepository(id)
}