const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//mid deal ware 
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e5xjxv3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const servicesCollations = client.db("design_agency").collection("services");
        const ordersCollations = client.db("design_agency").collection("orders");

        // service get api 
        app.get('/service', async (req, res) => {
            const services = await servicesCollations.find().toArray();
            res.send(services)
        });


        //service get one item api 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const services = await servicesCollations.findOne(query);
            res.send(services)
        });


        // post order api 
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollations.insertOne(order);
            res.send(result);

        })


        // get on your product 
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = ordersCollations.find(query)
            const order = await cursor.toArray();
            res.send(order);
        })

        // app.get('/order/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const result = await ordersCollations.findOne(query)
        //     res.send(result);

        // })



    }
    finally {
        // await client.close()

    }
}


run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`listening Port ${port}`)
})