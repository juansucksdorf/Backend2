import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    usuario: String, 
    password: String, 
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    carrito: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Cart" 
    }
});

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

export default UsuarioModel;
