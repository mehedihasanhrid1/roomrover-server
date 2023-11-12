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


// const rooms = [
//   {
// 		"title":"Super Laxury Room",
//       "image": "https://i.ibb.co/wKfZ6wh/h-6.jpg",
//       "price": "$180",
//       "roomSize": "500 sq. ft.",
//       "availability": "Available",
//       "roomDescription": "Experience luxury in our executive suite. This spacious suite offers a separate living area, a king-size bed, a well-equipped kitchenette, and a stunning ocean view. Ideal for a romantic getaway.",
//       "specialOffers": "Book for 3 nights and get the 4th night free.",
//       "capacity": "4",
// 	  "review": [
// 	  {
// 		"image": "https://lh3.googleusercontent.com/a/ACg8ocKWJDVT0493QEyxEy6cWb7J4Ak4J2iaTIY7XAkNKLOXxA=s96-c",
// 		"name": "Mehedi Hasan",
// 		"ratings":"4",
// 		"reviewTime":"2023-11-11",
// 		"CommentTitle":"Awsome Servie Provided",
// 		"comment":"The room was very beautiful.I have enjoyed it a lot."
// 	  },
//     {
//       "image": "https://mdbcdn.b-cdn.net/img/new/avatars/18.jpg",
//       "name": "Jessica Smith",
//       "ratings": "5",
//       "reviewTime": "2023-11-12",
//       "commentTitle": "A Wonderful Experience",
//       "comment": "Stunning views, impeccable service, and luxurious amenities. My stay at this Deluxe Ocean View Suite was absolutely delightful. I highly recommend it!"
//     },
//     {
//       "image": "https://mdbcdn.b-cdn.net/img/new/avatars/8.jpg",
//       "name": "John Anderson",
//       "ratings": "4",
//       "reviewTime": "2023-11-13",
//       "commentTitle": "Great for Family Getaway",
//       "comment": "The Family Retreat Villa provided the perfect setting for our family vacation. Spacious, clean, and well-equipped. The kids loved the private garden. Will definitely visit again!"
//     }
// 	  ]
//     },
//     {
//       "title": "Deluxe Ocean View Suite",
//       "image": "https://i.ibb.co/qW0vNkD/h-2.jpg",
//       "price": "$220",
//       "roomSize": "600 sq. ft.",
//       "availability": "Available",
//       "roomDescription": "Indulge in the ultimate comfort of our Deluxe Ocean View Suite. This spacious suite features a private balcony overlooking the serene ocean, a plush king-size bed, and a luxurious en-suite bathroom. Perfect for a relaxing escape.",
//       "specialOffers": "Complimentary breakfast for the entire stay.",
//       "capacity": "3",
//       "review": [
//         {
//         "image": "https://lh3.googleusercontent.com/a/ACg8ocKWJDVT0493QEyxEy6cWb7J4Ak4J2iaTIY7XAkNKLOXxA=s96-c",
//         "name": "Mehedi Hasan",
//         "ratings":"4",
//         "reviewTime":"2023-11-11",
//         "CommentTitle":"Awsome Servie Provided",
//         "comment":"The room was very beautiful.I have enjoyed it a lot."
//         },
//         {
//           "image": "https://mdbcdn.b-cdn.net/img/new/avatars/18.jpg",
//           "name": "Jessica Smith",
//           "ratings": "5",
//           "reviewTime": "2023-11-12",
//           "commentTitle": "A Wonderful Experience",
//           "comment": "Stunning views, impeccable service, and luxurious amenities. My stay at this Deluxe Ocean View Suite was absolutely delightful. I highly recommend it!"
//         },
//         {
//           "image": "https://mdbcdn.b-cdn.net/img/new/avatars/8.jpg",
//           "name": "John Anderson",
//           "ratings": "4",
//           "reviewTime": "2023-11-13",
//           "commentTitle": "Great for Family Getaway",
//           "comment": "The Family Retreat Villa provided the perfect setting for our family vacation. Spacious, clean, and well-equipped. The kids loved the private garden. Will definitely visit again!"
//         }
//         ]
//     },
//     {
//       "title": "Family Retreat Villa",
//       "image": "https://i.ibb.co/8Y6h2kN/h-5.jpg",
//       "price": "$300",
//       "roomSize": "800 sq. ft.",
//       "availability": "Available",
//       "roomDescription": "Create lasting memories with your family in our spacious Family Retreat Villa. This villa features multiple bedrooms, a fully equipped kitchen, and a private garden. Enjoy a home-like experience with the luxury of a hotel.",
//       "specialOffers": "Kids stay free with two paying adults.",
//       "capacity": "6",
//       "review": [
//         {
//         "image": "https://lh3.googleusercontent.com/a/ACg8ocKWJDVT0493QEyxEy6cWb7J4Ak4J2iaTIY7XAkNKLOXxA=s96-c",
//         "name": "Mehedi Hasan",
//         "ratings":"4",
//         "reviewTime":"2023-11-11",
//         "CommentTitle":"Awsome Servie Provided",
//         "comment":"The room was very beautiful.I have enjoyed it a lot."
//         },
//         {
//           "image": "https://mdbcdn.b-cdn.net/img/new/avatars/18.jpg",
//           "name": "Jessica Smith",
//           "ratings": "5",
//           "reviewTime": "2023-11-12",
//           "commentTitle": "A Wonderful Experience",
//           "comment": "Stunning views, impeccable service, and luxurious amenities. My stay at this Deluxe Ocean View Suite was absolutely delightful. I highly recommend it!"
//         },
//         {
//           "image": "https://mdbcdn.b-cdn.net/img/new/avatars/8.jpg",
//           "name": "John Anderson",
//           "ratings": "4",
//           "reviewTime": "2023-11-13",
//           "commentTitle": "Great for Family Getaway",
//           "comment": "The Family Retreat Villa provided the perfect setting for our family vacation. Spacious, clean, and well-equipped. The kids loved the private garden. Will definitely visit again!"
//         }
//         ]
//     }      
// ];


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

    //update the room
    // const roomsCollection = database.collection("rooms");
    // await roomsCollection.insertMany(rooms);
    
    app.get("/rooms", async (req, res) => {
      try {
        const roomsCollection = database.collection("rooms");
        const rooms = await roomsCollection.find({}).toArray();
        res.json(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "An error occurred while fetching rooms" });
      }
    });

    app.get("/rooms/:id", async (req, res) => {
      const roomId = req.params.id;
      try {
        const roomsCollection = database.collection("rooms");
        const room = await roomsCollection.findOne({ _id:new ObjectId(roomId) });
    
        if (room) {
          res.json(room);
        } else {
          res.status(404).json({ error: "Room not found" });
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ error: "An error occurred while fetching the room" });
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
