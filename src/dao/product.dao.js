import productModel from '../dao/models/product.model.js';


export const getAll = async (page = 1, limit = 10, query = {}, sort = 'asc') => {
    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: 'category',
            sort: { price: sort === 'asc' ? 1 : -1 }
        };

        const filter = {};
        if (query.category) {
            filter.category = query.category;
        }
        if (query.availability) {
            filter.availability = query.availability === 'true';
        }

        const products = await productModel.paginate(filter, options);
        return products;
    } catch (error) {
        console.error('Error al obtener todos los productos:', error.message);
        throw error;
    }
};


export const create = async (data) => {
    try {
        const product = await productModel.create(data);
        return product;
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        throw error;
    }
};


export const getById = async (id) => {
    try {
        const product = await productModel.findById(id);
        return product;
    } catch (error) {
        console.error('Error al obtener producto por ID:', error.message);
        throw error;
    }
};


export const update = async (id, updateData) => {
    try {
        const product = await productModel.findByIdAndUpdate(id, updateData, { new: true });
        return product;
    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        throw error;
    }
};


export const remove = async (id) => {
    try {
        await productModel.findByIdAndDelete(id);
        console.log('Producto eliminado correctamente.');
    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        throw error;
    }
};


export default {
    getAll,
    create,
    remove,
    update,
    getById,
};