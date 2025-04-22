const History = require('../models/history');

exports.getHistory = async (req, res) => {
  const history = await History.find({ userId: req.user._id }).sort({ timestamp: -1 });
  res.json(history);
};