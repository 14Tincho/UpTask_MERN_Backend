import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import cors from 'cors';

const app = express();
app.use(express.json(), usuarioRoutes);

dotenv.config()

conectarDB();

// Configurar Cors
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.includes(origin)) {
            //Puede consultar la API
            callback(null, true);
        }else{
            //No esta permitido
            callback(new Error('Error de Cors'))
        }
    },
};
app.use(cors(corsOptions))

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})

// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor,{
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {    
    // Definir los eventos de socket.io
    // conectado con el emit('abrir proyecto') de Proyecto.jsx adentro de frontend/pages
    socket.on('abrir proyecto', (proyecto) => {
        // Esto hace que cada persona entre a un socket diferente, a pesar que varios entren al mismo proyecto
        socket.join(proyecto)
    } )

    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit("tarea eliminada", tarea)
    })

    socket.on('actualizar tarea', (tarea) => {
        // EL _id es pq te regresa el objeto completo
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })
    
    socket.on('cambiar estado', (tarea) => {
        // EL _id es pq te regresa el objeto completo
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    })
})



//Estas son las dependencias que estaban en el package.json(Para que funcione este registro, se tiene que tener esto. Tambien se necesita el node module)
//"express": "^4.17.3",         npm i express          Para poder conectarnos a la Base de Datos
//"nodemon": "^2.0.15"          npm i -D nodemon        Este comando hace que la pagina se refresque sola cuando haya algun cambio. El -D significa que es de desarrollo y van a las dependencias de desarrollo
//"mongoose": "^6.2.10"         npm i mongoose          Para simplificar los llamados a la base de datos de MongoDB 
//"dotenv": "^16.0.0",          npm i dotenv            Busca al archivo .env que contiene a las variables de entorno
//"bcrypt": "^5.0.1",           npm i bcrypt            Para poder hashear la contraseña
//"jsonwebtoken": "^8.5.1",     npm i jsonwebtoken      Genera un token en formato json. Lo usamos como validacion
//"cors": "^2.8.5",             npm i cors              Para poder conectarse con el FrontEnd(conectar el lcoalhost 4000 q es este con el localhost 3000 que es el del Frontend)
//"nodemailer": "^6.7.5"        npm install nodemailer  Enviar Emails
// Crearse una cuenta en mailtrap. Es como para ver si funcionan las enviadas al mail
//"Socket.io": "^4.5.1"         npm i socket.io         Para que la página se conecte en tiempo real

// EN package.json:
// Aca realizamos un cambio, pusimos el dev y le pusimos q se meta por el nodemon que es el de desarrollo/ desarrolladores
// Tambien agregamos el start, para q es si pueda meterse desde la otra manera


// Mongo DB
// Vamos a usar Mongo DB como base de datos pero para simplificar los llamados, vamos a usar un orm llamado mongoose(npm i mongoose)
// Lo seguimos en config-->db.js


// Heroku
// En Heroku podes hospedar aplicaciones de hasta 500mg gratis
// Se descarga en esta url: https://devcenter.heroku.com/articles/heroku-cli
// heroku login             Para iniciar en el navegador con tu cuenta
// heroku create            Crea una aplicacion en blanco
// git push heroku main     Sincroniza heroku y git
// Adentro del proyecto te metes en el config vars (Reveal Config Vars) y pones las variables que tenes en el .env