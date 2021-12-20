const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // On crypte le mot de passe
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash // On utilise le hash en créant le nouvel utilisateur pour sécuriser le mot de passe dans la bse de données
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // On récupère l'utilisateur de la base qui correspond à l'adresse mail entrée 
    .then(user => {
      if(!user) { // Si l'email n'existe pas, on renvoie une erreur
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }
      bcrypt.compare(req.body.password, user.password) // On compare le mot de passe entré avec le hash qui est inscrit dans la base de données
        .then(valid => {
          if (!valid) { // Si le mot de passe et le hash ne correspondent pas, on renvoie une erreur
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          res.status(200).json({ // Si le mot de passe et le hash correspondent, on renvoie l'userId et le TOKEN d'authentification
            userId: user._id,
            token: jwt.sign( // On va encoder le userId et le token grâce à la fonction sign de jsonwebtoken
              { userId: user._id }, // On encode le userId car ça nous permet de savoir qui a modifié/créé quoi dans l'application. Pour donner des accès différents aux utilisateurs.
              process.env.TOKEN, // C'est la clef pour déchiffrer le token
              { expiresIn: '1000h' }
            )
          }); // Le token a donc été renvoyé à l'utilisateur.
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};