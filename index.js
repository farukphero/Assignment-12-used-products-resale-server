const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8uhbkvb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productsCollection = client
      .db("usedProductResale")
      .collection("products");
    const newProductsCollection = client
      .db("usedProductResale")
      .collection("newproducts");
    const usersCollection = client
      .db("usedProductResale")
      .collection("users");

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: ObjectId(id) };
      const products = await productsCollection.findOne(query);
      res.send(products);
    });

    app.get("/newproducts", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const newProducts =await newProductsCollection.find(query).toArray();
      res.send(newProducts);
    });
     

    app.post("/newproducts", async (req, res) => {
      const products = req.body;
      const result = await newProductsCollection.insertOne(products);
      products.id = result.insertedId;
      res.send(result);
    });
      
    app.post('/users', async (req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })



  } finally {
  }
}

run().catch((error) => console.log(error));

app.get("/", async (req, res) => {
  res.send("used product resale server running");
});
app.listen(port, () => console.log(`Resale product running ${port}`));
