import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import connectToDB from "./config/index.js"
import {__dirname} from "./utils.js"
import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import routerV from './routers/views.router.js';
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';


const app = express();
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
app.engine("handlebars",handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views",__dirname+"/views")

app.use('/api/products', routerP)
app.use('/api/carts', routerC)
app.use('/', routerV);

const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Escuchando puerto ${PORT}`);
        console.log(`1. http://localhost:${PORT}/api/products`)
        console.log(`2. http://localhost:${PORT}/api/carts`);
    }
    catch (err) {
        console.log(err);
    }});

const socketServer = new Server(httpServer)

socketProducts(socketServer),
socketChat(socketServer)

export default function connectToDB(){ 
    mongoose.connect('mongodb+srv://marianomct:xYiTcNb7obVHFuwh@cluster0.r9mdjki.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('BD conectada'))
    .catch(() => console.log('Error en conexion a BD'))
} 