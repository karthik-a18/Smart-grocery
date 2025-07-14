const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  weight: String,
  avgPrice: Number,
  storePrices: Object
});
module.exports = mongoose.model('Item', itemSchema);