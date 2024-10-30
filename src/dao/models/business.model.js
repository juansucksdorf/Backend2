import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    name: String, 
    products: []
});

const BusinessModel = mongoose.model("business", businessSchema);

module.exports = BusinessModel;