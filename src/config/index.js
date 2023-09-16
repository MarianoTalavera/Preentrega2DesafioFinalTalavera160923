import express from 'express';
import mongoose from "mongoose";

const app = express()
const PORT = 8080
app.use(express.json())

mongoose.connect('mongodb+srv://marianomct:<password>@cluster0.r9mdjki.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('BD conectada'))
.catch(() => console.log('Error en conexion a BD'))