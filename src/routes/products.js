import express from 'express';
import productDao from '../dao/product.dao.js';
import cartDao from '../dao/cart.dao.js'; 

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        const products = await productDao.getAll(page, limit, query, sort);

        res.render('products', { products: products.docs, totalPages: products.totalPages, currentPage: products.page });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al obtener productos', error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        console.log('Product ID recibido:', productId);
        const product = await productDao.getById(productId);

        if (!product) {
            res.status(404).render('productDetails', { product: null, message: 'Producto no encontrado' });
            return;
        }

        res.render('productDetails', { product });
    } catch (err) {
        console.error('Error al obtener producto por ID:', err.message);
        res.status(500).render('productDetails', { product: null, message: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productDao.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;

        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({ error: 'Se requieren campos para actualizar el producto.' });
            return;
        }

        if ('quantity' in updatedFields) {
            delete updatedFields.quantity;
        }

        await productDao.update(productId, updatedFields);
        res.status(200).json({ message: 'Producto actualizado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el producto.', message: err.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        await productDao.remove(productId);
        res.status(200).json({ message: 'Producto eliminado correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto.', message: err.message });
    }
});

router.post('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity, 10) || 1;

        await cartDao.addProductToCart(cartId, productId, quantity);

        res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar producto al carrito.', message: err.message });
    }
});

export default router;
