import {
    obtenerTodos as obtenerTodosService,
    obtenerPorId as obtenerPorIdService,
    crear as crearService,
    actualizar as actualizarService,
    eliminar as eliminarService
} from "../services/juegos.service.js"


// GET /juegos
export async function obtenerTodos(req, res) {
    try {
        const juegos = await obtenerTodosService(
            req.usuario.id
        )

        res.json(juegos)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}


// GET /juegos/:id
export async function obtenerPorId(req, res) {
    try {
        const juego = await obtenerPorIdService(
            req.params.id,
            req.usuario.id
        )

        res.json(juego)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}


// POST /juegos
export async function crear(req, res) {
    try {
        const nuevo = await crearService(
            req.body,
            req.usuario.id
        )

        res.status(201).json(nuevo)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}


// PUT /juegos/:id
export async function actualizar(req, res) {
    try {
        const id = req.params.id
        const actualizado = await actualizarService(
            id,
            req.body,
            req.usuario.id
        )

        res.json(actualizado)

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}


// DELETE /juegos/:id
export async function eliminar(req, res) {
    try {
        const id = req.params.id

        await eliminarService(
            id,
            req.usuario.id
        )

        res.json({ mensaje: "Juego " + id + " eliminado" })

    } catch (error) {
        res.status(error.status || 500).json({ mensaje: error.message })
    }
}