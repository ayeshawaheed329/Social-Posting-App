const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    creator:{
        type: Object,
        require: true,
    },
    },
    { timeStamps: true },
);

module.exports = mongoose.model('Post', postSchema);