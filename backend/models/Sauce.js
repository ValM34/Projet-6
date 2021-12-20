const mongoose = require('mongoose');

const saucesSchema = mongoose.Schema({
  userId: { type: String, require: true },
  name: { type: String, required: true },
  manufacturer: { type: String, require: true },
  description: { type: String, require: true },
  mainPepper: { type: String, require: true },
  imageUrl: { type: String, require: true },
  heat: { type: Number, require: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, required: false },
  usersDisliked: { type: Array, required: false },
});

module.exports = mongoose.model('Sauce', saucesSchema);

// Ici on a notre modèle de produit

