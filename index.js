const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from ema-jhon-server');
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tzinyke.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCollection = client.db('ema-john-db').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            console.log(products);
            res.send({ count, products });
        });

        app.post('/productsbyid', async (req, res) => {
            const ids = req.body;
            const objectId = ids.map(id => ObjectId(id));
            const query = { _id: { $in: objectId } };
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

    }
    finally {

    }
}

run().catch(err => console.error(err));



app.listen(port, () => {
    console.log('Ema-john-server is running on port :', port);
});