const mongoose = require('mongoose');
const CollectionSchema = new mongoose.Schema({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  baseUrl: String,
  requests: Array
});
module.exports = mongoose.model('Collection', CollectionSchema);