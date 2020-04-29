const express = require(`express`);
const cors = require(`cors`);
const monk = require(`monk`);
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();

const db = monk( process.env.MONGO_URI || `localhost/croaker`);
const croaks = db.get('croaks')
filter = new Filter();

const limiter = rateLimit({
    windowMs: 10 * 1000, // every 30 secs
    max: 1 // limit each IP to 1 requests per windowMs
  });


app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());


app.get(`/`, (req, res) => {
    res.json({
        message: 'Croak! 🐸'
    })
})

app.get(`/croaks`, ( req, res) => {
    croaks
        .find()
        .then(croaks =>{
            res.json(croaks);
        });
 });

function isValidCroak(croak){
    return croak.name && croak.name.toString().trim() !== '' && 
            croak.content && croak.content.toString().trim() !== ''
}

app.use(limiter);

app.post(`/croaks`, (req, res) =>{
    if(isValidCroak(req.body)){

        const croak = {
            name: filter.clean( req.body.name.toString() ),
            content: filter.clean( req.body.content.toString() ),
            created: new Date(),
        }

        croaks
        .insert(croak)
        .then(createdCroak => {
            res.json(createdCroak);
        });

    }else{
        res.status(422);
        res.json({
            message: 'Name and Content are required!'
        });
        console.log('not valid')
    }
})

app.listen(5000, () =>{
    console.log(`listening on: http://localhost:5000`)
})