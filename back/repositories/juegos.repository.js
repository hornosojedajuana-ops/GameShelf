import mongoose from "mongoose"
import { Juego } from "../models/juego.js"

function idValido(id) {
    return mongoose.isValidObjectId(id)
}


export async function buscarTodos(usuarioId) {
    return await Juego.find({
        usuario: usuarioId
    })
}


export async function buscarPorId(id) {
    if (!idValido(id)) {
        return null
    }

    return await Juego.findById(id)
}


export async function buscarPorJuegoId(juegoId, usuarioId) {
    return await Juego.findOne({
        juegoId: juegoId,
        usuario: usuarioId
    })
}


export async function guardar(datos) {
    const nuevo = new Juego(datos)

    return await nuevo.save()
}


export async function actualizar(id, datos) {
    if (!idValido(id)) {
        return null
    }

    return await Juego.findByIdAndUpdate(
        id,
        datos,
        { new: true }
    )
}


export async function eliminar(id) {
    if (!idValido(id)) {
        return null
    }

    return await Juego.findByIdAndDelete(id)
}