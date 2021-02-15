const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const items = require('./schema/schema');
const Schema = require('./schema/schema');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://Gosha:lzk56gk5@cluster0.hxqey.mongodb.net/react-node-app?retryWrites=true&w=majority', {
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('Connected to DB');    
    }catch(e){
        throw err;
    }
}

connect();

app.post('/addToDo', jsonParser, async (req, res) => {
    console.log(req.body.items);
    const save = await Schema.findOne({type:'items'}, async (err, docs) => {
            if(!docs){
                return false;
            }
            if(docs){
                await req.body.items.map((el) => {
                    docs.content.push(el);
                })  
                docs.save();
                return true;
            }
        })
    if(save){
        res.send(JSON.stringify({message:'Save items :)'}));
    }
    if(!save){
        const items = new Schema({
            date:new Date(),
            content:req.body.items,
            type:'items'
        })
        await items.save();
        res.send(JSON.stringify({message:'Save items :)'}));
    }
})

app.post('/loadItems', jsonParser, async (req, res) => {
    await Schema.findOne({type:'items'}, (err, docs) => {
        if(docs.content.length === 0){
            res.send(JSON.stringify({content:'Dont data'}));
            return;
        }
        if(docs.content.length > 0){
            res.send(JSON.stringify({content:docs.content}));
            return;
        }
    })
})

app.post('/deleteItems', jsonParser, async (req, res) => {
    await Schema.findOne({type:'items'}, async (err, docs) => {
        const newList = await docs.content.filter(el => {
            if(el.id !== req.body.message){
                return el;
            }
        })
        
        docs.content = newList;
        docs.save(() => {
            res.send('Delete items');
            return;
        });
    })
})
    
app.listen(6000);