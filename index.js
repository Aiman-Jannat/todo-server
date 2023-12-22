const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

//middleware

app.use(express.json());
app.use(cors());

//connect to mongodb


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzvbxiw.mongodb.net/?retryWrites=true&w=majority`;

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

    const db = client.db("todo");
    const userCollection = db.collection("users")
    const tasksCollection = db.collection("tasks");

    app.get('/',(req,res)=>{
        res.send("To do is runnning")
    })

    app.post('/users', async (req, res) => {
        const user = req.body;
        // console.log("user",user)
        const query = { email: user.email };
        const existingUser = await userCollection.findOne(query);
        // console.log(existingUser);
        if (existingUser) {
          return res.send({ message: "user already exist", insertedId: null })
        }
    
        const result = await userCollection.insertOne(user);
        res.send(result);
      })

      app.post('/tasks', async(req,res)=>{
        const data = req.body;
        const result = await tasksCollection.insertOne(data);
        res.send(result);

      })

      app.get('/tasks/:email', async (req, res) => {
        const email = req.params.email;
        console.log(email)
        const query = { email: email };
        const user = await tasksCollection.find(query).toArray();
         res.send(user);
      })

      app.delete('/tasks/delete/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id:new ObjectId(id) };
        const result = await tasksCollection.deleteOne(query);
        res.send(result);
      })

      app.get('/tasks/specific/:id', async (req, res) => {
        const id = req.params.id;
        console.log("id-",id)
        const query = { _id: new ObjectId(id)};
        const result = await tasksCollection.findOne(query);
        res.send(result);
      })

      app.put('/tasks/update/:id', async (req, res) => {
        const id= req.params.id;
        const update = req.body;
   console.log("update",update)
        const filter = {
            _id: new ObjectId(id)
        };
        const options={
            upsert:true
          }
          const updatedUser={
            $set:{
                title:update.title,
                deadline:update.deadline,
                priority:update.priority,
                description:update.description,
                
              
              
      
            }
          }
        const result = await tasksCollection.updateOne(filter,updatedUser);
        res.send(result);
      })










   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log("TO DO is running")
  })