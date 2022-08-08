import express from "express";
import {    
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyectos,
    eliminarProyectos,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
} from "../controller/proyectoController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route('/').get(checkAuth, obtenerProyectos).post(checkAuth, nuevoProyecto)

router.route('/:id').get(checkAuth, obtenerProyecto).put(checkAuth, editarProyectos).delete(checkAuth, eliminarProyectos)

router.post('/colaboradores', checkAuth, buscarColaborador)

router.post('/colaboradores/:id', checkAuth, agregarColaborador)

// Con el delete no se puede enviar valores, por eso se pone el post en este caso
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador)
export default router;