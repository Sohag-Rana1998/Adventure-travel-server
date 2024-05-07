const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors({
  origin: ['http://localhost:5173', 'https://travel-zone-client-side.web.app', 'https://travel-zone-client-side.web.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())
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




const logger = (req, res, next) => {
  console.log('log info', req.method, req.url);
  next();
}
const verifyToken = (req, res, next) => {
  const token = req?.cookies?.token;
  console.log('token:', token);
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized access' })
    }
    req.user = decoded
    next();
  })

}



const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

async function run() {
  try {

    // await client.connect();

    const touristSpotCollection = client.db("touristSpotDB").collection("touristSpot");

    const testimonialCollection = client.db("sohagislambd1998").collection("Testimonials");

    const countriesCollection = client.db("sohagislambd1998").collection("countriesDB");



    app.post('/jwt', async (req, res) => {
      const user = req.body;
      console.log('User for token', user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res
        .cookie('token', token, cookieOptions)
        .send({ success: true })
    })


    app.post('/logout', async (req, res) => {
      const user = req.user;
      console.log('from logout', user);
      res.clearCookie("token", { ...cookieOptions, maxAge: 0 })
        .send({ success: true });
    })



    // Get All Spots Data From Here

    app.get('/tourist-spot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // Get Reviews data From Here

    app.get('/testimonials', async (req, res) => {
      const cursor = testimonialCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // Get countries data from here
    app.get('/countries', async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // Get single tourists spot data by id from here
    app.get('/tourist-spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query)
      res.send(result)
    })

    // Get single review here
    app.get('/testimonials/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await testimonialCollection.findOne(query)
      res.send(result)
    })

    // Get single countries tourists spot data by countryName from here
    app.get("/country/:CountryName", async (req, res) => {
      const CountryName = req.params.CountryName;
      console.log(CountryName);
      const result = await touristSpotCollection.find({ CountryName: CountryName }).toArray();
      res.send(result)
    })


    // Get User Data By Email
    app.get("/mylist", logger, verifyToken, async (req, res) => {
      console.log(req.query?.email);
      console.log(req.user);
      if (req.query.email !== req.user.email) {
        return res.status(403).send({ message: 'Forbidden excess' })
      }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result)
    })


    //  Insert a single tourists spot from here
    app.post('/add-tourist-spot', async (req, res) => {
      const spot = req.body;
      console.log(spot);
      const result = await touristSpotCollection.insertOne(spot);
      res.send(result);
    })

    // Insert a single customer review from here
    app.post('/add-testimonials', async (req, res) => {
      const testimonial = req.body;
      console.log(testimonial);
      const result = await testimonialCollection.insertOne(testimonial);
      res.send(result);
    })

    // Update a single tourists spot data from here
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

    // Update a single tourists spot data from here
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


    // Delete a tourists spot by id here
    app.delete("/tourist-spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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