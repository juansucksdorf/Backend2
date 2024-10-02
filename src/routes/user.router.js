import { Router } from "express";
import UsuarioModel from "../dao/models/usuario.model.js";
import jwt from "jsonwebtoken"; 
import passport from "passport";
import { createHash, isValidPassword } from "../utils/util.js";
import { registerUser } from "../managers/user.manager.js";

const router = Router(); 
router.post("/register", async (req, res) => {
    const { usuario, password } = req.body; 

    try {
        const existeUsuario = await UsuarioModel.findOne({ usuario }); 

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        const hashedPassword = createHash(password);
        const nuevoUsuario = await registerUser({ usuario, password: hashedPassword }); 

        const token = jwt.sign({ _id: nuevoUsuario._id, usuario: nuevoUsuario.usuario }, process.env.JWT_SECRET, { expiresIn: "1h" }); 

        // Guardar el token en una cookie
        res.cookie("jwtToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        });

        // Redirigir a la página de inicio con el mensaje de bienvenida
        res.redirect("/home");  // Cambia la redirección a /home

    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
});


router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const usuarioEncontrado = await UsuarioModel.findOne({ usuario });

        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no identificado");
        }

        if (!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Usuario o contraseña inválidos!");
        }

        const token = jwt.sign({ _id: usuarioEncontrado._id, usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Guardar el token en una cookie
        res.cookie("jwtToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        });

        
        res.redirect("/api/sessions/home"); 
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});


router.post("/logout", (req, res) => {
    res.clearCookie("jwtToken"); 
    res.redirect("/login"); 
});

router.get("/home", passport.authenticate("current", { session: false }), (req, res) => {
    res.render("home", { usuario: req.user.usuario }); 
});
router.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    return res.json({ user: req.user });
});

router.get("/admin", passport.authenticate("current", { session: false }), (req, res) => {
    if (req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado"); 
    }
    res.render("admin");
});

export default router;
