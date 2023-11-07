const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion , ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: '*',
  credential: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}

app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lbqsrfq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("RoomRover");
    app.post("/feedback", async (req, res) => {
      try {
        const userFeedback = database.collection("userQuery");
        const feedback = req.body;
        const result = await userFeedback.insertOne(feedback);
        res.status(201).json({ message: "Feedback submitted successfully" });
      } catch (error) {
        console.error("Error saving user feedback:", error);
        res.status(500).json({ error: "An error occurred while saving feedback" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('The server is running.');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
