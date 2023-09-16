import { Router } from 'express';
import { __dirname } from "../utils.js";
import ProductManager from "../dao/managers/productManagerMongo.js"
const pManager = new ProductManager()

const routerV = Router()


routerV.get("/",async(req,res)=>{
    const listadeproductos = await pManager.getProductsView()
    console.log(listadeproductos)
    res.render("home",{listadeproductos})
})

routerV.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})

routerV.get("/chat",(req,res)=>{
res.render("chat")
})

export default routerV