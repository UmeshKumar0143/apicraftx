const mongoose = require('mongoose');
const HistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  method: String,
  url: String,
  headers: Object,
  body: Object,
  response: Object,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('History', HistorySchema);
