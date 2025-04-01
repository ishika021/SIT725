const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  stationName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  type: { type: String, required: true },
  cost: { type: Number, default: 0 },
  description: String,
  image: String,
});

module.exports = mongoose.model('Station', stationSchema);
