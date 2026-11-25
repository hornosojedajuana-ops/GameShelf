import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import { conectarBase } from "./config/db.js"

import usuariosRouter from "./routes/usuarios.routes.js"
import juegosRouter from "./routes/juegos.routes.js"

import { pedirToken } from "./middlewares/auth.middleware.js"


await conectarBase()

const app = express()

const PORT = process.env.PORT || 3000


app.use(cors())

app.use(express.json())


app.use((req, res, next) => {
    console.log(req.method + " " + req.url)
    next()
})


app.get("/", (req, res) => {
    res.send("Bienvenidos a GameShelf")
})


app.use("/usuarios", usuariosRouter)

app.use("/juegos", pedirToken, juegosRouter)


app.use((req, res) => {
    res.status(404).json({ mensaje: "Esa ruta no existe" })
})


app.use((err, req, res, next) => {
    console.error(err)

    const codigo = err.status || 500
    res.status(codigo).json({
        mensaje: "Algo salió mal (error " + codigo + ")"
    })
})


app.listen(PORT, (error) => {
    if (error) {
        console.log("No se pudo abrir el puerto " + PORT)
        console.log("¿Ya tenés el servidor prendido en otra terminal?")
        return
    }

    console.log("GameShelf abierto en http://localhost:" + PORT)
})