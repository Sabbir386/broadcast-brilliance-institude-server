const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const express = require('express');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2phr5m.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();
        const classesCollection = client.db('classesData').collection('class');
        const instructorsCollection = client.db('classesData').collection('instructor');
        const usersSelectedCollection = client.db('classesData').collection('bookingClass');
        const usersCollection = client.db('classesData').collection('users');
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        //users api collection
        app.post('/users', async (req, res) => {
            const body = req.body;
            const existingUser = await usersCollection.findOne(query);

            if (existingUser) {
                return res.send({ message: 'user already exists database' })
            }
            const result = await usersCollection.insertOne(body);
            res.send(result);

        })
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find({}).toArray();
            res.send(result);
        })
        //admin route
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        //instructor route
        app.patch('/users/instructor/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'instructor'
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);

        })

        //selected booking class
        app.post('/bookingClass', async (req, res) => {
            const body = req.body;
            const result = await usersCollection.insertOne(body);
            res.send(result);

        })
        //get booking class by email
        app.get('/bookingClass', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { email: email };
            const result = await usersSelectedCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/bookingClass/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);

            const query = { _id: new ObjectId(id) };
            const result = await usersSelectedCollection.deleteOne(query);
            res.send(result);
        })

        // allClasses api 
        app.get('/allClasses', async (req, res) => {
            const result = await classesCollection.find({}).toArray();
            res.send(result);

        })

        //instructors api
        app.get('/allinstructors', async (req, res) => {
            const result = await instructorsCollection.find({}).toArray();
            res.send(result);

        })

        // app.put('/allToys/:updateId', async (req, res) => {
        //     const id = req.params.updateId;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updateToy = req.body;
        //     const toy = {
        //         $set: {

        //             name: updateToy.name,
        //             photoUrl: updateToy.photoUrl,
        //             sellerName: updateToy.sellerName,
        //             sellerEmail: updateToy.sellerEmail,
        //             subCategory: updateToy.subCategory,
        //             price: updateToy.price,
        //             ratings: updateToy.ratings,
        //             availableQuantity: updateToy.availableQuantity,
        //             availableQuantity: updateToy.availableQuantity,
        //         }
        //     }
        //     const result = await toyCollection.updateOne(filter, toy, options);
        //     res.send(result);

        // })



        // app.delete('/allToys/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id);
        //     const query = { _id: new ObjectId(id) };
        //     const result = await toyCollection.deleteOne(query);
        //     res.send(result);
        // })
        // app.get('/allToys/:Category', async (req, res) => {
        //     if (req.params.Category == 'MathToys') {
        //         const result = await toyCollection.find({ subCategory: req.params.Category }).toArray();
        //         return res.send(result);
        //     }
        //     else if (req.params.Category == 'EngineeringToys') {
        //         const result = await toyCollection.find({ subCategory: req.params.Category }).toArray();
        //         return res.send(result);
        //     }
        //     else if (req.params.Category == 'LanguageToys') {
        //         const result = await toyCollection.find({ subCategory: req.params.Category }).toArray();
        //         return res.send(result);
        //     }
        //     else {
        //         const result = await toyCollection.find({}).toArray();
        //         return res.send(result);
        //     }

        // })




    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.z2phr5m.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Brilliance Institude running');
})
app.listen(port, () => {
    console.log(`Brilliance Institude running on port ${port}`);
})
