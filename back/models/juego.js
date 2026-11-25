import mongoose from "mongoose"


export const ESTADOS = [
    "quiero jugar",
    "jugando",
    "terminado"
]


const juegoSchema = new mongoose.Schema({

    juegoId: {
        type: Number,
        required: true
    },

    titulo: {
        type: String,
        required: true
    },

    imagen: {
        type: String,
        required: true
    },

    genero: {
        type: String,
        required: true
    },

    plataforma: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        enum: ESTADOS,
        default: "quiero jugar"
    },

    nota: {
        type: String,
        default: ""
    },

    fechaDeCreacion: {
        type: Date,
        default: Date.now
    },

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    }

})


export const Juego = mongoose.model("Juego", juegoSchema)