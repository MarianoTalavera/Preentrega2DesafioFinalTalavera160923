import { Router } from 'express';
import ProductManager from '../dao/managers/productManagerMongo.js';
const routerP = Router()

const manager = new ProductManager()

routerP.get('/', async (req, res) =>{
    const { limit, page, sort } = req.query;
    try{
        const options = {limit: limit || 10, page: page || 1, sort: { price: sort ?? sort}}
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const products = await productModel.paginate(filter || options)
        res.status(200).send({response: 'ok', message: products})
    }catch(error){
        res.status(404).send({response: 'error', message: error})
    }})

  routerP.get("/:pid", async (req, res) => {
    const {pid}=req.params
    const productfind = await manager.getProductById(pid);
    res.json({ status: "success", productfind });
  });

  routerP.post("/", async (req, res) => {
    const obj=req.body
    const newproduct = await manager.addProduct(obj);
     res.json({ status: "success", newproduct });
  });

  routerP.put("/:pid", async (req, res) => {
    const {pid}=req.params
    const obj=req.body
    const updatedproduct = await manager.updateProduct(pid,obj);
    console.log(updatedproduct)
     res.json({ status: "success", updatedproduct });
  });

  routerP.delete("/:pid", async (req, res) => {
    const id=req.params.pid
    const deleteproduct = await manager.deleteProduct(id);
     res.json({ status: "success",deleteproduct });
  });

export default routerP