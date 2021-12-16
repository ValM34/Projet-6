const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Sert à pouvoir éviter les erreurs possibles au niveau de l'email pour notre cas

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

// Ici on a notre modèle d'utilisateur