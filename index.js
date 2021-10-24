const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000
// midleware
app.use(cors())
app.use(express.json())
// user:geniusCar pass :w0yCqzzPiW15T3bJ
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrpwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('connected to db')
        const databse = client.db('carMechanic')
        const servicesCollection = databse.collection('services')
        //  get api for all data 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
    //    get single data 
    app.get('/services/:id',async(req,res)=>{
        const id=req.params.id 
        const query={_id:ObjectId(id)}
        const service=await servicesCollection.findOne(query)
        res.json(service)
    })
        //  post api
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await servicesCollection.insertOne(service)
            console.log('hit the post')
            res.json(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running genius server ')
})
app.listen(port, () => {
    console.log('Running genius database server on', port)
})