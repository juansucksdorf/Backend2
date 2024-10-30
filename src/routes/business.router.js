import { getBusiness, createBusiness, getBusinessById, addProduct } from  "../controllers/bisness.controller.js";

const Router = require("express").Router;
const router = Router(); 

router.get("/", getBusiness);
router.post("/", createBusiness);

router.get("/:bid", getBusinessById);
router.post("/:bid/product", addProduct);


module.exports = router; 