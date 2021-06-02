// Imports
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const asyncLib = require("async");

// Constantes
const email_regex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_regex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;

// Routes
module.exports = {
  registrer: function (req, res) {
    // Paramètres
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;

    if (email === null || username === null || password === null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }
    // verifier la longueur pseudo, mail regex, password etc
    if (username.length >= 25 || username.length <= 4) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    if (!email_regex.test(email)) {
      return res.status(400).json({ error: "email non valide" });
    }

    if (!password_regex.test(password)) {
      return res.status(400).json({
        error:
          "mot de passe non valide, 8 caractères minimum, contenant au moins une lettre minuscule, une lettre majuscule, un chiffre numérique et un caractère spécial",
      });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            attributes: ["email"],
            where: { email: email },
          })
            // passe dans le then avec done qui sert de callback, le paramètre null signifie qu'on souhaite passer à la suite
            // on applique le paramètre userFound car on en a besoin dans la fonction suivante
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        // si utilisateur n'est pas existant, on utilise bcrypt pour hasher le password
        // dans le cas contraire on renvoit une erreur
        function (userFound, done) {
          if (!userFound) {
            bcrypt.hash(password, 5, function (err, bcryptedPassword) {
              done(null, userFound, bcryptedPassword);
            });
          } else {
            return res.status(409).json({ error: "utilisateur déjà existant" });
          }
        },
        // si mot de passe hasher, on crée un nouvel utilisateur
        function (userFound, bcryptedPassword, done) {
          const newUser = models.User.create({
            email: email,
            username: username,
            password: bcryptedPassword,
            bio: bio,
            isAdmin: 0,
          })
            .then(function (newUser) {
              done(newUser);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "ajout utilisateur impossible" });
            });
        },
      ],
      // on vérifie si l'argument newUser existe, si c'est le cas on renvoie comme quoi il a été créé
      function (newUser) {
        if (newUser) {
          return res.status(201).json({
            userId: newUser.id,
          });
        } else {
          return res
            .status(500)
            .json({ error: "ajout utilisateur impossible" });
        }
      }
    );
  },
  login: function (req, res) {
    // Paramètres
    const email = req.body.email;
    const password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
            where: { email: email },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        // si utilisateur trouvé via son mail, on compare le mot de passe
        function (userFound, done) {
          if (userFound) {
            bcrypt.compare(
              password,
              userFound.password,
              function (errBycrypt, resBycrypt) {
                done(null, userFound, resBycrypt);
              }
            );
          } else {
            return res
              .status(404)
              .json({ error: "utilisateur absent de la base de donnée" });
          }
        },
        // si le mot de passe est décodé, c'est bien le bon utilisateur
        function (userFound, resBycrypt, done) {
          if (resBycrypt) {
            done(userFound);
          } else {
            return res.status(403).json({ error: "mot de passe invalide" });
          }
        },
      ],
      // si le bon utilisateur on affiche son id et on lui attribut un token pour la session
      function (userFound) {
        if (userFound) {
          return res.status(201).json({
            userId: userFound.id,
            token: jwt.sign(
              {
                userId: userFound.id,
                isAdmin: userFound.isAdmin,
              },
              process.env.TOKEN,
              { expiresIn: "24h" }
            ),
          });
        } else {
          return res
            .status(500)
            .json({ error: "login utilisateur impossible" });
        }
      }
    );
  },
  getUserProfile: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    models.User.findOne({
      attributes: ["id", "email", "username", "bio"],
      where: { id: userId },
    })
      .then(function (user) {
        if (user) {
          res.status(201).json(user);
        } else {
          res.status(404).json({ error: "utilisateur introuvable" });
        }
      })
      .catch(function (err) {
        res
          .status(500)
          .json({ error: "impossible de récupérer l'utilisateur" });
      });
  },
  updateUserProfile: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    // Paramètres
    const bio = req.body.bio;

    asyncLib.waterfall(
      [
        // récupère l'utilisateur dans la DBase
        function (done) {
          models.User.findOne({
            attributes: ["id", "bio"],
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (userFound, done) {
          if (userFound) {
            userFound
              .update({
                bio: bio ? bio : userFound.bio,
              })
              .then(function () {
                done(userFound);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "mise à jour utilisateur impossible" });
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (userFound) {
        if (userFound) {
          return res.status(201).json(userFound);
        } else {
          return res
            .status(500)
            .json({ error: "mise à jour du profil utilisateur impossible" });
        }
      }
    );
  },
};
