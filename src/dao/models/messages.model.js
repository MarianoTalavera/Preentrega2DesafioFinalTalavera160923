import mongoose from 'mongoose';

const collection = "Messages";

const messagesSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    postTime: {
        type: Date,
        default: Date.now
    }})

const messageModel = mongoose.model(collection, messagesSchema);

export default messageModel;