const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 9000
const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 
    'https://artcraft-a2b1a.web.app',
     'https://artcraft-a2b1a.firebaseapp.com',
    ],
    Credential: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t1cnfqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      
        const cardsCollection = client.db('artCraft').collection('cards')
        const craftCollection = client.db('artCraft').collection('craft')
        
      
    //   Get all cards data from db
    app.get('/cards', async(req, res)=> {
        const result = await cardsCollection.find().toArray()
        res.send(result)
    })


    // Get a single cards data from db using card id
    app.get('/card/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await cardsCollection.findOne(query)
      res.send(result)
    })


    // save a craft data in db
    app.post('/craft', async(req, res) => {
      const craftData = req.body
      
      const result = await craftCollection.insertOne(craftData)
      res.send(result)
    })

    // get all crafts posted by a specific user
    app.get('/crafts/:email', async(req, res) => {
      const email = req.params.email
      const query = { 'buyer.email': email }
      const result = await craftCollection.find(query).toArray()
      res.send(result)
  })

    // delete a craft data from db
    app.delete('/craft/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.deleteOne(query)
      res.send(result)
  })

  // update a craft data from db
  


      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Hello from artCraft service')
})

app.listen(port, ()=>console.log(`server running on port ${port}`))