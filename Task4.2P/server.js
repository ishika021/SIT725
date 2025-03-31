const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uri = "mongodb://127.0.0.1:27017/evCharging";

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let collection;

async function startServer() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db('evCharging');
    collection = database.collection('stations');
    
    app.listen(port, () => {
      console.log(`Server running on port http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

app.get('/api/stations', async (req, res) => {
  try {
    const stations = await collection.find({}).toArray();
    res.status(200).json({ status: 200, data: stations, message: "Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Failed to fetch stations" });
  }
});

app.post('/api/stations', async (req, res) => {
  try {
    const newStation = req.body;
    const result = await collection.insertOne(newStation);
    res.status(201).json({ status: 201, data: result, message: "Station added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Failed to add station" });
  }
});

app.put('/api/stations/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updatedStation = req.body;
  
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedStation }
      );
  
      if (result.modifiedCount === 1) {
        res.status(200).json({ status: 200, message: "Station updated successfully" });
      } else {
        res.status(404).json({ status: 404, message: "Station not found or unchanged" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 500, message: "Failed to update station" });
    }
  });
  

app.delete('/api/stations/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount === 1) {
        res.status(200).json({ status: 200, message: 'Station deleted successfully' });
      } else {
        res.status(404).json({ status: 404, message: 'Station not found' });
      }
    } catch (err) {
      console.error('Error deleting station:', err);
      res.status(500).json({ status: 500, message: 'Failed to delete station' });
    }
  });

startServer();