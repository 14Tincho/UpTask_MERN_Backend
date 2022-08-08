import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        fechaEntrega:{
            type: Date,
            default: Date.now(),
        },
        cliente: {
            type: String,
            required: true,
            trim: true,
        },
        creador: {
            type: mongoose.Schema.Types.ObjectId,
            // El ref lo que hace es mostrarle de donde tiene que tomar el campo para relacionarlo. Lo encuentro en el penultimo renglon de model-->usuario
            ref: "Usuario",
        },
        tareas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tarea",  
            },
        ],
        colaboradores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usuario",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Proyecto = mongoose.model("Proyecto", proyectoSchema)
export default Proyecto