const express=require('express')
const app=express()
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000

// middleware
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT',"PATCH", 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekjerqg.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
  

    const toyCollection= client.db('toyCarsDb').collection('allToys');

    // Sorting options
    // const sortByPriceAsc = { price: 1 }; // Ascending order
    // const sortByPriceDesc = { price: -1 }; // Descending order

    //---------------------- get api------------------------------
    app.get('/allProducts',async (req,res)=>{
        const result =await toyCollection.find().limit(20).toArray();
        res.send(result);
    })

    app.get('/allProducts/:email', async(req,res)=>{
        const email=req.params.email;
        const query={ sellerEmail: email }
        const result= await toyCollection.find(query).toArray()
        res.send(result)
    })

    app.get('/toy/:id', async (req, res) => {
        const id=req.params.id;
        console.log(id)
        const query={ _id : new ObjectId(id)}
        const result= await toyCollection.findOne(query)
        res.send(result)
    })

    app.get('/category/:category', async(req,res)=>{
        const category=req.params.category;
        console.log(category)
        const query={ subCategory: category }
        const result= await toyCollection.find(query).toArray()
        res.send(result)
    })

    //----------------post api---------------------------------
    app.post('/allProducts',async (req,res)=>{
        const singleToy=req.body;
        console.log(singleToy)
        const result=await toyCollection.insertOne(singleToy)
        res.send(result)
    })

    //------------------ update api ---------------------
    app.patch('/allProducts/:id',async(req,res)=>{
      const id =req.params.id
      const updateToy=req.body
        console.log(updateToy)
      const filter={ _id : new ObjectId(id)}
      const toy={
        $set:{
          price:updateToy.price,
          quantity:updateToy.quantity,
          description:updateToy.description
        }
      }

      const result= await toyCollection.updateOne(filter,toy)
      res.send(result)
    })

    //---------------- delete api -----------------------
    app.delete('/allProducts/:id',async(req,res)=>{
        const id =req.params.id
        
        const query={ _id : new ObjectId(id)}
        const result= await toyCollection.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Welcome to Toy Cars server')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})