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

/*
userId like la sauce. 
On vérifie s'il est présent dans le array.
  Il est présent: on le retire du array, on fait -1 like.
  Il n'est pas présent: on le rajoute dans le array, on fait +1 like.
*/
/*
exports.likeOneSauce = (req, res, next) => {
  const userExiste = Sauce.findOne({ usersLiked: req.params.userId })
    if(!userExiste){
      const tableau = req.body.usersLiked;
      const nouveauTableau = tableau.push(userId);
      const nombreDeLikes = // Nombre de id dans le array
      Sauce.updateOne({ _id: req.params.id }, { ...req.body, usersLiked: nouveauTableau })
    }
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Like modifié !' }))
    .catch(error => res.status(400).json({ error }));
};
*/