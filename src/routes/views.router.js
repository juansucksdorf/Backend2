import { Router } from "express";
import passport from "passport";  

const router = Router(); 

router.get("/login", (req, res) => {
    res.render("login"); 
});

router.get("/register", (req, res) => {
    res.render("register"); 
});

router.get("/home", passport.authenticate("current", { session: false }), (req, res) => {
    res.render("home");
});


export default router;
