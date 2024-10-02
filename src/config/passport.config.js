import passport from "passport";
import jwt from "passport-jwt";
import UsuarioModel from "../dao/models/usuario.model.js"; 

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwtToken"]; 
    }
    return token;
};

const initializePassport = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET,
    }, async (jwt_payload, done) => {
        try {
            
            const user = await UsuarioModel.findById(jwt_payload._id); 
            if (user) {
                return done(null, user);
            } else {
                return done(null, false); 
            }
        } catch (error) {
            return done(error, false); 
        }
    }));
};

export default initializePassport;
