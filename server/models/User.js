const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  mobile: String,
  cart: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: Number
  }]
});
module.exports = mongoose.model('User', userSchema);