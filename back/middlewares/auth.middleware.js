import jwt from "jsonwebtoken"

export function pedirToken(req, res, next) {

    const cabecera = req.headers.authorization

    if (!cabecera) {
        return res.status(401).json({
            mensaje: "No mandaste el token"
        })
    }

    const token = cabecera.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            mensaje: "El token vino mal escrito. Tiene que ser: Bearer <token>"
        })
    }

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET)

        req.usuario = datos

        next()

    } catch (error) {
        return res.status(401).json({
            mensaje: "El token no es válido o ya venció"
        })
    }
}