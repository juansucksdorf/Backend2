
import UsuarioModel from '../dao/models/usuario.model.js'; 
import Cart from '../dao/models/cart.model.js'; 

export async function registerUser(usuarioData) {
    try {
        const newCart = await Cart.create({ products: [] }); 
        const newUser = await UsuarioModel.create({
            ...usuarioData,
            carrito: newCart._id 
        });
        return newUser;
    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        throw err;
    }
}
