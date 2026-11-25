import mongoose from "mongoose"

const usuarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    fechaDeCreacion: {
        type: Date,
        default: Date.now
    }

})

export const Usuario = mongoose.model("Usuario", usuarioSchema)