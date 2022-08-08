// ERRORES
// 404:Cuando no encontraste algo
// 403:Cuando no tienes los permisos adecuados
// 401:Requiere que el usuario no esta autenticado


import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async(req, res) => {
    // POSTMAN: nombre, descripcion, prioridad, proyecto(colocamos el id del proyecto)
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if(!existeProyecto){
        const error = new Error('El proyecto no existe')
        return res.status(404).json({ msg: error.message })
    }
    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('No tienes los permisos para añadir tareas')
        return res.status(404).json({ msg: error.message })
    }
    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        // Almacenar el ID en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }
}

const obtenerTarea = async(req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if (!tarea) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida')
        return res.status(403).json({ msg: error.message })
    }
    res.json(tarea)
}

const actualizarTarea = async(req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if (!tarea) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida')
        return res.status(403).json({ msg: error.message })
    }

    // Hace q en caso de que no este presente el req body, asigne el q tiene registrado en la BBDD
    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega
    
    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error);
    }

    //res.json(tarea)
}

const eliminarTarea = async(req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if (!tarea) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error('Accion no válida')
        return res.status(403).json({ msg: error.message })
    }

    try {
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)

        // Se pone el Promise.allSettled para no poner dos veces el await seguido. para que no bloquee las siguientes lineas dos veces. Toma un arreglo de awaits
        // El Promise.all hace exactamente lo mismo para este ejemplo
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
        res.json({msg: 'La Tarea se Eliminó'})
    } catch (error) {
        console.log(error);
    }

}

const cambiarEstado = async(req, res) => {
    
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto")
    
    if (!tarea) {
        const error = new Error('Tarea no encontrada')
        return res.status(404).json({ msg: error.message })
    }

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some( colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error('Accion no válida')
        return res.status(403).json({ msg: error.message })
    }

    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id;

    await tarea.save();

    const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate("completado")
    
    res.json(tareaAlmacenada);
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}