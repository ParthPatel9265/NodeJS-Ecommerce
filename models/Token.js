const mongoose = require('mongoose');
const tokenSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    },
    token:{
        type:String
    }
});

module.exports = mongoose.model("Token", tokenSchema);
