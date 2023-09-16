import { Router } from 'express';
import { __dirname } from "../utils.js"
import CartManager from "../dao/managers/cartManagerMongo.js"
import ProductManager from "../dao/managers/productManagerMongo.js"

const cm = new CartManager()
const pm = new ProductManager()

const routerC = Router()

routerC.get("/", async(req,res)=>{
    const carrito=await cm.getCarts()
    res.json({carrito})
})

routerC.get("/:cid",async(req,res)=>{
  const{cid}=req.params
    const carritofound=await cm.getCartById(cid)
    res.json({status:"success",carritofound})
})

routerC.post('/', async (req, res) => {
  try {
      const { obj } = req.body;

      if (!Array.isArray(obj)) {
        return res.status(400).send('Los productos tienen que estar en un array');
      }

      const validProducts = [];

      for (const product of obj) {
          const checkId = await pm.getProductById(product._id);
          if (checkId === null) {
            return res.status(404).send(`No se encontró el producto con ID ${product._id}`);
          }
          validProducts.push(checkId);
      }

      const cart = await cm.addCart(validProducts);
      res.status(200).send(cart);
 
  } catch (err) {
       console.log(err);
       res.status(500).send('Internal Server Error');
   }});

routerC.post("/:cid/products/:pid", async (req, res) => {
     const { cid, pid } = req.params;
     const { quantity } = req.body;
   
     try {
       const checkIdProduct = await pm.getProductById(pid);
       if (!checkIdProduct) {
         return res.status(404).send({ message: `No se encontró el producto con ID ${pid}` });
       }
   
       const checkIdCart = await cm.getCartById(cid);
       if (!checkIdCart) {
         return res.status(404).send({ message: `No se encontró el carrito con ID ${cid}` });
       }
   
       const result = await cm.addProductInCart(cid, { _id: pid, quantity:quantity });
       console.log(result);
       return res.status(200).send({
         message: `Producto con ID: ${pid} agregado al carrito con ID: ${cid}`,
         cart: result,
       });
     } catch (error) {
       console.error("Ocurrió un error:", error);
       return res.status(500).send({ message: "Ocurrió un error procesando el request" });
     }});

routerC.put('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const { products } = req.body;

      for (const product of products) {
          const checkId = await pm.getProductById(product._id);

          if (!checkId) {
              return res.status(404).send({ status: 'error', message: `No se encontró el producto con ID ${product._id} ` });
          }}

      const checkIdCart = await cm.getCartById(cid);
      if (!checkIdCart) {
          return res.status(404).send({ status: 'error', message: `No se encontró el carrito con ID ${cid}` });
      }

      const cart = await cm.updateProductsInCart(cid, products);
      return res.status(200).send({ status: 'success', payload: cart });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 'error', message: 'Ocurrió un error procesando el request' });
  }});

routerC.delete('/:cid/product/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;

      const checkIdProduct = await pm.getProductById(pid);
      if (!checkIdProduct) {
          return res.status(404).send({ status: 'error', message: `No se encontró el producto con ID ${pid}` });
      }

      const checkIdCart = await cm.getCartById(cid);
      if (!checkIdCart) {
          return res.status(404).send({ status: 'error', message: `No se encontró el carrito con ID ${cid}` });
      }

      const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid);
      if (findProductIndex === -1) {
          return res.status(404).send({ status: 'error', message: `No se encontró el producto con ID ${pid} en el carrito` });
      }

      checkIdCart.products.splice(findProductIndex, 1);
      const updatedCart = await cm.deleteProductInCart(cid, checkIdCart.products);

      return res.status(200).send({ status: 'success', message: `Producto con ID ${pid} eliminado`, cart: updatedCart });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 'error', message: 'Ocurrió un error procesando el request' });
  }});

   routerC.delete('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cm.getCartById(cid);
  
      if (!cart) {
        return res.status(404).send({ message: `No se encontró el carrito con ID ${cid}` });
      }
  
      if (cart.products.length === 0) {
        return res.status(404).send({ message: 'El carrito ya está vacío' });
      }
  
      cart.products = [];
      await cm.updateOneProduct(cid, cart.products);
      return res.status(200).send({
        status: 'success',
        message: `Se vació correctamente el carrito con ID ${cid}`,
        cart: cart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Ocurrió un error procesando el request' });
    }});

export default routerC