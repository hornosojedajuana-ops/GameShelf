import {
    registrarUsuario,
    loginUsuario,
    obtenerUsuario
} from "../services/usuarios.service.js"

//Usuarios/registro
export async function registrar(req, res) {
    try {
        const nuevo = await registrarUsuario(req.body)
        res.status(201).json(nuevo)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

//Usuarios/ogin
export async function login(req, res) {
    try {
        const resultado = await loginUsuario(req.body)
        res.json(resultado)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}

//Usuarios/yo
export async function yo(req, res) {
    try {
        const usuario = await obtenerUsuario(req.usuario.id)
        res.json(usuario)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}