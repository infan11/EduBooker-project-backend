const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// midle
app.use(express.json())
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.lopynog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        const usersCollection = client.db("EduBooker").collection("users")
        const collegesCollection = client.db("EduBooker").collection("colleges")
        const papersCollection = client.db("EduBooker").collection("papers")
        const reviewsCollection = client.db("EduBooker").collection("reviews")
        const admissionFormCollection = client.db("EduBooker").collection("admissionForm")

        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        // colleges card api 
        app.get("/colleges", async (req, res) => {
            const result = await collegesCollection.find().toArray();
            res.send(result)
        })
        app.get("/colleges/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collegesCollection.findOne(query);
            res.send(result)
        })

        app.put("/colleges/:name", async (req, res) => {
            const name = req.params.name;
            const newReview = req.body.review; 
          
            const query = { name: name }; 
            const updateDoc = {
              $push: { reviews: newReview }, 
            };
        
              const result = await collegesCollection.updateOne(query, updateDoc);
              res.send(result);
           
          });
        // reserach paper api
        app.get("/papers", async (req, res) => {
            const result = await papersCollection.find().toArray();
            res.send(result);
        })
        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })
        app.post("/reviews", async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })
        // admission form api
        app.get("/admissionForm", async (req, res) => {
            const result = await admissionFormCollection.find().toArray();
            res.send(result);
        })
        app.post("/admissionForm", async (req, res) => {
            const admissionForm = req.body;
            const result = await admissionFormCollection.insertOne(admissionForm);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("EduBooker server running")
})
app.listen(port, () => {
    console.log(`Signel server running port : ${port}`)
})