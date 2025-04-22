const History = require('../models/history');

exports.getHistory = async (req, res) => {
  const history = await History.find({ userId: req.user._id }).sort({ timestamp: -1 });
  res.json(history);
};

exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params; 

    const result = await History.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'History not found' });
    }

    return res.status(200).json({ message: 'History deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};