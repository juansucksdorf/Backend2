import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'; 

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
        quantity: { type: Number, default: 1, required: true } 
    }]
});


cartSchema.plugin(mongoosePaginate); 

const Cart = mongoose.model('Cart', cartSchema);

export default Cart; 
