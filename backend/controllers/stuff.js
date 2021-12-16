const Sauce = require('../models/Sauce');
const fs = require('fs');

/* fs signifie « file system » (soit « système de fichiers », en français). 
Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, 
y compris aux fonctions permettant de supprimer les fichiers. */

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // On extrait le nom du fichier à supprimer
      fs.unlink(`images/${filename}`, () => { // On supprime le fichier
        Sauce.findOne({ _id: req.params.id }).then( // On récupère le sauce dans la base de données
          (sauce) => {
            if (!sauce) {
              res.status(404).json({
                error: new Error('No such Sauce!')
              });
            }
            if (sauce.userId !== req.auth.userId) { // On vérifie que le sauce appartient bien à la personne qui fait la requête
              res.status(400).json({
                error: new Error('Unauthorized request!')
              });
            }
            Sauce.deleteOne({ _id: req.params.id }) // On supprime l'objet de la base de données
              .then( // Si c'est la bonne personne, on effectue la suppression
                () => {
                  res.status(200).json({
                    message: 'Deleted!'
                  });
                }
              ).catch(
                (error) => {
                  res.status(400).json({
                    error: error
                  });
                }
              );
          }
        )
      });
    })
    .catch(error => res.status(500).json({ error }));

};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.likeOneSauce = (req, res, next) => {

  console.log(req.body);
  console.log(req.body.userId);
  console.log(req.params.id);

  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
      .then(() => res.status(200).json({ message: 'Like ajouté !' }))
      .catch(error => res.status(400).json({ error }));
  } else if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        console.log(sauce);
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};

