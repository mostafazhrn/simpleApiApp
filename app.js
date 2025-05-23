const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/catdb');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
let jwt = require('jsonwebtoken');
//let fs = require('fs');
//let privateKey = fs.readFileSync('private.key', 'utf8');

let token = jwt.sign({name: 'test'}, 'mySecretKey')//, { algorithm: 'HS384'});
console.log(token);
let result = jwt.verify(token, 'mySecretKey')//, { algorithm: 'HS384'});
console.log(result);
const cats = mongoose.model('cats', {
    name: String
});
//parse application JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//method override
app.use(methodOverride('X-HTTP-Method-Override'));


app.get('/api', (req, res) => {
    res.send('welcome to the API!');
}); 

//Get
app.get('/api/cats', async(req, res) => {
    try{
        const cat = await cats.find({});
        res.send(cat);
    }catch(err){
        console.log(err);
    }
})

//Post
app.post('/api/cats/create', (req, res) => {
    const cat = new cats({
        name: req.body.name
    });
    cat.save().then(() => {
        res.send('cat added successfully!');
    }).catch((err) => {
        console.log(err);
    });
}
) 
//PUT
app.put('/api/cats/update/:id', (req, res) => {
    const id = req.params.id;
    cats.findByIdAndUpdate(id, {
        name: req.body.name
    }).then(() => {
        res.send('cat updated successfully!');
    }).catch((err) => {
        console.log(err);
    });
})

//DELETE
app.delete('/api/cats/delete/:id', (req, res) => {
    const id = req.params.id;
    cats.findByIdAndDelete(id).then(() => {
        res.send('cat deleted successfully!');
    }).catch((err) => {
        console.log(err);
    });
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});