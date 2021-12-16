const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // On sélectionne le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On vérifie que le token est correct grâce à la clef
    const userId = decodedToken.userId;
    req.auth = { userId }; // On ajoute l'userId à l'objet req
    if (req.body.userId && req.body.userId !== userId) { // On vérifie si l'userId a les autorisations nécessaires pour effectuer l'action qu'il souhaite
      throw '403: unauthorized request'; // Si l'utilisateur n'a pas le droit d'accéder alors on déclenche une erreur
    } else { // Dans ce cas, l'utilisateur a le droit d'effectuer l'action qu'il souhaite effectuer
      next(); // On passe la requête au prochain middleware
    }
  } catch (error) {
    res.status(401).json({ error: error || 'Requête non authentifiée !' });
  }
};