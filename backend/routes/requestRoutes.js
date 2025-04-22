const axios = require('axios');
const History = require('../models/history');

exports.    executeRequest = async (req, res) => {
  const { method, url, headers, body } = req.body;
  try {
    const response = await axios({ method, url, headers, data: body });
    await History.create({ userId: req.user._id, method, url, headers, body, response: response.data });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Request failed', error: err.message });
  }
};