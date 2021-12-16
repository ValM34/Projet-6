const multer = require('multer'); // On importe multer qui est un package de gestion des fichiers

const MIME_TYPES = { // On note les types d'images qu'on souhaite accepter
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split('').join('_') // Pour gérer les espaces possibles, on les remplace par des underscores
    const extension = MIME_TYPES[file.mimetype]; // On rajoute l'extension sur nos fichiers
    callback(null, name + Date.now() + '.' + extension); 
  }
});

module.exports = multer({ storage }).single('image'); // On met .single pour spécifier que c'est un fichier unique et image pour spécifier que c'est des fichiers image