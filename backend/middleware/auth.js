const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDdiZGIwMDY0NmJiY2U2MjAwMzAxMyIsImlhdCI6MTc0NTM0MTIxNCwiZXhwIjoxNzQ1OTQ2MDE0fQ.30Jzf6d1QRqk6tZJSzSnyMR-LWok2E9thkzFGCknxpg';
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
module.exports = auth;