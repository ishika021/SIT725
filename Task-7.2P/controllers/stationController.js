const Station = require('../models/Station');

exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.status(200).json({ status: 200, data: stations, message: 'Success' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Failed to fetch stations' });
  }
};

exports.createStation = async (req, res) => {
  try {
    const newStation = new Station(req.body);
    const result = await newStation.save();
    res.status(201).json({ status: 201, data: result, message: 'Station added successfully' });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Failed to add station' });
  }
};

exports.updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Station.findByIdAndUpdate(id, req.body, { new: true });
    if (result) {
      res.status(200).json({ status: 200, message: 'Station updated successfully' });
    } else {
      res.status(404).json({ status: 404, message: 'Station not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Failed to update station' });
  }
};

exports.deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Station.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ status: 200, message: 'Station deleted successfully' });
    } else {
      res.status(404).json({ status: 404, message: 'Station not found' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Failed to delete station' });
  }
};