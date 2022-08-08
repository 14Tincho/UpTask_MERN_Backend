import jwt from "jsonwebtoken";
//import { Jwt } from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Las linea de union del route es un middleware
// El next es para que pase al siguiente middleware, en el usuarioRoutes
const checkAuth = async (req, res, next) => {
    let token;
    // En authorization nos podemos meter en postman y dsp le ponemos de type:bearer token.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -__v -createdAt -updatedAt");

            return next()
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'})
        }
    }

    if (!token) {
        const error = new Error('token no válido')
        return res.status(401).json({msg: error.message})
    }
    next()
}

export default checkAuth