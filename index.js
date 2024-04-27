const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iulixph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const touristSpotCollection = client.db("touristSpotDB").collection("touristSpot");

    const testimonialCollection = client.db("sohagislambd1998").collection("Testimonials");
    // const userCollection = client.db("countryDB").collection("countrySpot");

    // app.post('/users', async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result)

    // })

    // app.get('/users', async (req, res) => {
    //   const cursor = userCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result)


    // })

    // app.get('/users/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) }
    //   const result = await userCollection.findOne(query);
    //   res.send(result)
    // })


    // app.patch('/users', async (req, res) => {
    //   const user = req.body;
    //   const filter = {
    //     email: user.email,
    //   }
    //   const updateUser = {
    //     $set: {
    //       name: user?.name,

    //     }
    //   }
    //   const result = await userCollection.updateOne(filter, updateUser);
    //   res.send(result)
    // })
    // app.put('/users', async (req, res) => {
    //   const user = req.body;
    //   const filter = {
    //     email: user.email,
    //   }
    //   const updateUser = {
    //     $set: {
    //       signInTime: user.signInTime,
    //     }
    //   }
    //   const result = await userCollection.updateOne(filter, updateUser);
    //   res.send(result)
    // })

    // app.delete('/users/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) }
    //   const result = await userCollection.deleteOne(query);
    //   res.send(result)
    // })


    app.get('/tourist-spot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/testimonials', async (req, res) => {
      const cursor = testimonialCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // app.get('/tourist-spot/:email', async (req, res) => {
    //   const userEmail = req.params.email;
    //   console.log(userEmail);
    //   const query = { email: new userEmail }
    //   const result = await touristSpotCollection.find(query).toArray;
    //   res.send(result)
    // })

    app.get('/tourist-spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query)
      res.send(result)
    })

    app.post('/add-tourist-spot', async (req, res) => {
      const spot = req.body;
      console.log(spot);
      const result = await touristSpotCollection.insertOne(spot);
      res.send(result);
    })
    app.post('/testimonials', async (req, res) => {
      const testimonial = req.body;
      console.log(testimonial);
      const result = await touristSpotCollection.insertOne(testimonial);
      res.send(result);
    })

    app.put("/tourist-spot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTouristSpot = req.body;
      const coffee = {
        $set: {
          photo: updatedTouristSpot.photo,
          spotName: updatedTouristSpot.spotName,
          CountryName: updatedTouristSpot.CountryName,
          location: updatedTouristSpot.location,
          description: updatedTouristSpot.description,
          averageCost: updatedTouristSpot.averageCost,
          season: updatedTouristSpot.season,
          travelTime: updatedTouristSpot.travelTime,
          visitor: updatedTouristSpot.visitor,
          userName: updatedTouristSpot.userName,
          email: updatedTouristSpot.email
        }
      }
      const result = await touristSpotCollection.updateOne(filter, coffee, options);
      res.send(result)
    })
    app.patch("/tourist-spot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedTouristSpot = req.body;
      const coffee = {
        $set: {
          photo: updatedTouristSpot.photo,
          spotName: updatedTouristSpot.spotName,
          CountryName: updatedTouristSpot.CountryName,
          location: updatedTouristSpot.location,
          description: updatedTouristSpot.description,
          averageCost: updatedTouristSpot.averageCost,
          season: updatedTouristSpot.season,
          travelTime: updatedTouristSpot.travelTime,
          visitor: updatedTouristSpot.visitor,
          userName: updatedTouristSpot.userName,
          email: updatedTouristSpot.email
        }
      }
      const result = await touristSpotCollection.updateOne(filter, coffee, options);
      res.send(result)
    })


    app.delete("/tourist-spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
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



app.get('/', (req, res) => {
  res.send('Travel zone server is running')
})

app.listen(port, () => {
  console.log(`Travel server is running on port${port}`);
})