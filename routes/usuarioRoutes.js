import express from "express";

const router = express.Router();

import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from '../controller/usuarioController.js'
import checkAuth from "../middleware/checkAuth.js";

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)

// Esto es lo mismo q lo de abajo
// router.get('/olvide-password/:token', comprobarToken)
// router.post('/olvide-password/:token', nuevoPassword)

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

// Aca hace que se ejecute este middleware y que dsp vaya al perfil
router.get('/perfil', checkAuth, perfil)

export default router;