const Collection = require('../models/collection');

exports.createCollection = async (req, res) => {
  const { name, baseUrl, requests } = req.body;
  const collection = await Collection.create({ name, baseUrl, requests, userId: req.user._id });
  res.status(201).json(collection);
};

exports.getCollections = async (req, res) => {
  const collections = await Collection.find({ userId: req.user._id });
  res.json(collections);
};

exports.deleteCollection = async (req, res) => {
  const { id } = req.params;
  await Collection.findByIdAndDelete(id);
  res.json({ message: 'Collection deleted' });
};