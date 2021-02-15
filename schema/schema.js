const { Schema, model } = require('mongoose');

const items = {
    date:{
        type:Date
    },
    content:{
        type:Array
    },
    type:{
        type:String
    }
}

module.exports = model('items', items, 'items');