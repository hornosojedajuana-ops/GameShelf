import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import {
    buscarPorEmail,
    buscarPorId,
    guardar
} from "../repositories/usuarios.repository.js"


function errorCon(status, mensaje) {
    const error = new Error(mensaje)
    error.status = status

    return error
}


const VUELTAS = 10


function sinPassword(usuario) {
    return {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        fechaDeCreacion: usuario.fechaDeCreacion
    }
}


function validar(datos) {
    const nombre = datos.nombre
    const email = datos.email
    const password = datos.password

    if (!nombre || !email || !password) {
        throw errorCon(
            400,
            "Faltan datos: nombre, email y contraseña"
        )
    }

    if (password.length < 6) {
        throw errorCon(
            400,
            "La contraseña tiene que tener al menos 6 caracteres"
        )
    }

    return {
        nombre: nombre,
        email: email,
        password: password
    }
}


async function chequearEmailLibre(email) {
    const existente = await buscarPorEmail(email)

    if (existente) {
        throw errorCon(
            409,
            "Ya existe una cuenta con el email " + email
        )
    }
}


// registro

export async function registrarUsuario(datos) {
    const limpios = validar(datos)

    await chequearEmailLibre(limpios.email)

    const hash = await bcrypt.hash(limpios.password, VUELTAS)

    const guardado = await guardar({
        nombre: limpios.nombre,
        email: limpios.email,
        password: hash
    })

    return sinPassword(guardado)
}


// login

export async function loginUsuario(datos) {
    if (!datos.email || !datos.password) {
        throw errorCon(400, "Faltan datos")
    }

    const usuario = await buscarPorEmail(datos.email)

    if (!usuario) {
        throw errorCon(
            401,
            "Email o contraseña incorrectos"
        )
    }

    const coincide = await bcrypt.compare(
        datos.password,
        usuario.password
    )

    if (!coincide) {
        throw errorCon(
            401,
            "Email o contraseña incorrectos"
        )
    }

    const token = jwt.sign(
        { id: usuario._id },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    )

    return {
        token: token,
        usuario: sinPassword(usuario)
    }
}


export async function obtenerUsuario(id) {
    const usuario = await buscarPorId(id)

    if (!usuario) {
        throw errorCon(
            404,
            "No existe un usuario con id " + id
        )
    }

    return sinPassword(usuario)
}