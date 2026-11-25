import express from "express"

import { registrar, login, yo } from "../controllers/usuarios.controller.js"

import { pedirToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/registro", registrar)
router.post("/login", login)
router.get("/yo", pedirToken, yo)

export default router