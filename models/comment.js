const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    publisher: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    title: {
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = mongoose.model("Comment", commentSchema);