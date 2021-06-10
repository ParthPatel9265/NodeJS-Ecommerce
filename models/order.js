const mongoose = require('mongoose');
const moment = require('moment');
const orderSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt:{
        type: String,
        required: true,
        default: moment().format("YYYY-MM-DD")
    },
    details:[{
        quantity:{
            type: Number,
            required: true
        },
        book:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        }
        
    }],
    price:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);