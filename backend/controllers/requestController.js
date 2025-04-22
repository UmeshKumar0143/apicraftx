const axios = require('axios');
const History = require('../models/history');


exports.executeRequest = async (req, res) => {
  const { method, url, headers = {}, body } = req.body;
  console.log('Request body:', req.body);

  // Validate inputs
  if (!method || !url) {
    return res.status(400).json({ message: 'Method and URL are required' });
  }
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!validMethods.includes(method.toUpperCase())) {
    return res.status(400).json({ message: 'Invalid HTTP method' });
  }
  try {
    new URL(url);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers,
      data: body,
      validateStatus: () => true,
    });

    console.log('Response data:', response.data);

    await History.create({
      userId: req.user._id,
      method,
      url,
      headers,
      body,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
      },
    });

    res.json({
      status: response.status,
      statusText: response.statusText,
      body: response.data,
    });
  } catch (err) {
    console.error('Request error:', err.message);
    res.status(500).json({ message: 'Request failed', error: err.message });
  }
};