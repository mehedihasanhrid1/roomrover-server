const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); 
const port = process.env.PORT || 5000;

const corsConfig = {
  origin:['http://localhost:5173' , 'https://room-rover.web.app' , 'https://room-rover.firebaseapp.com'],
credentials:true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};


app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lbqsrfq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// const rooms = [
//     {
//       "title": "Deluxe Ocean View Suite",
//       "image": "https://i.ibb.co/RzLK443/h-16.jpg",
//       "price": "$220",
//       "roomSize": "600 sq. ft.",
//       "roomDescription": "Indulge in the ultimate comfort of our Deluxe Ocean View Suite. This spacious suite features a private balcony overlooking the serene ocean, a plush king-size bed, and a luxurious en-suite bathroom. Perfect for a relaxing escape.",
//       "specialOffers": "Complimentary breakfast for the entire stay.",
//       "capacity": "3",
//       "review": [
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

const verifyUser = (req, res, next) => {
  const token = req.cookies.JWT_TOKEN;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      } else {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    req.user = decoded;
    next();
  });
};
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
        res
          .status(500)
          .json({ error: "An error occurred while saving feedback" });
      }
    });


    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: '1h'
      });
      res.cookie('JWT_TOKEN', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'none'
          })
          .send({ success: true })
  })

app.post("/logout", (req, res) => {
  res.clearCookie('JWT_TOKEN', {maxAge: 0});
  res.status(200).json({ message: "Logout successful" });
});



    app.post("/bookings", async (req, res) => {
      try {
        const userBookings = database.collection("Bookings");
        const bookings = req.body;
        const result = await userBookings.insertOne(bookings);
        res.status(201).json({ message: "Booking Data Updated successfully" });
      } catch (error) {
        console.error("Error update booking:", error);
        res
          .status(500)
          .json({ error: "An error occurred while saving booking data" });
      }
    });

    app.put("/update/review/:id", async (req, res) => {
      try {
        const roomId = req.params.id;
        const { review } = req.body; 
    
        const result = await database.collection("rooms").updateOne(
          { _id: new ObjectId(roomId) },
          { $push: { review: review } }
        );
    
        if (result.matchedCount === 0) {
          res.status(404).json({ error: "Room not found" });
        } else {
          res.status(200).json({ message: "Review added successfully" });
        }
      } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ error: "Server error" });
      }
    });
    

    app.get("/bookings/cart", verifyUser , async (req, res) => {
      const { email } = req.query;
      try {
        const bookings = await database
          .collection("Bookings")
          .find({ email })
          .toArray();
        res.json(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching bookings" });
      }
    });

    app.delete("/bookings/:bookingId", async (req, res) => {
      try {
        const { bookingId } = req.params;
        const deletedBooking = await database.collection("Bookings").deleteOne({
          _id: new ObjectId(bookingId),
        });
        if (deletedBooking.deletedCount === 1) {
          res.status(200).json({ message: "Booking canceled successfully." });
        } else {
          res.status(404).json({ error: "Booking not found." });
        }
      } catch (error) {
        console.error("Error canceling booking:", error);
        res
          .status(500)
          .json({ error: "An error occurred while canceling the booking." });
      }
    });

    //update the room
    // const roomsCollection = database.collection("rooms");
    // await roomsCollection.insertMany(newRooms);

    app.get("/rooms", async (req, res) => {
      try {
        const roomsCollection = database.collection("rooms");
        const rooms = await roomsCollection.find({}).toArray();
        res.json(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching rooms" });
      }
    });


app.put("/bookings/:id", async (req, res) => {
  try {
    const  bookingId  = req.params.id;
    const { checkin_date, checkout_date } = req.body;
    const result = await database
          .collection("Bookings")
          .updateOne({ _id: new ObjectId(bookingId) }, { $set: { checkin_date, checkout_date } });
        if (result.matchedCount === 0) {
          res.status(404).send("Room not found");
        } else {
          res.status(200).send("Booking Date updated successfully");
        }
      } catch (error) {
        console.error("Error updating Booking Date:", error);
        res.status(500).send("Server error");
      }
});


    app.get("/rooms/:id", async (req, res) => {
      const roomId = req.params.id;
      try {
        const roomsCollection = database.collection("rooms");
        const room = await roomsCollection.findOne({
          _id: new ObjectId(roomId),
        });

        if (room) {
          res.json(room);
        } else {
          res.status(404).json({ error: "Room not found" });
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching the room" });
      }
    });

    app.put("/update/:id", async (req, res) => {
      try {
        const roomId = req.params.id;
        const { capacity } = req.body;

        const result = await database
          .collection("rooms")
          .updateOne({ _id: new ObjectId(roomId) }, { $set: { capacity } });

        if (result.matchedCount === 0) {
          res.status(404).send("Room not found");
        } else {
          res.status(200).send("Room capacity updated successfully");
        }
      } catch (error) {
        console.error("Error updating room capacity:", error);
        res.status(500).send("Server error");
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The server is running.");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
