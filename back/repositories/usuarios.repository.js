import mongoose from "mongoose"
import { Usuario } from "../models/usuario.js"

function idValido(id) {
    return mongoose.isValidObjectId(id)
}

export async function buscarPorEmail(email) {
    return await Usuario.findOne({ email: email })
}

export async function buscarPorId(id) {
    if (!idValido(id)) {
        return null
    }

    return await Usuario.findById(id)
}

export async function guardar(datos) {
    const nuevo = new Usuario(datos)

    return await nuevo.save()
}