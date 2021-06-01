// Imports
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
// Routes
module.exports = {
  registrer: function (req, res) {
    // Params
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let bio = req.body.bio;

    if (email === null || username === null || password === null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    // TODO verifier la longueur pseudo, mail regex, password etc
    models.User.findOne({
      attributes: ["email"],
      where: { email: email },
    })
      .then(function (userFound) {
        if (!userFound) {
          bcrypt.hash(password, 5, function (err, bcryptedPassword) {
            const newUser = models.User.create({
              email: email,
              username: username,
              password: bcryptedPassword,
              bio: bio,
              isAdmin: 0,
            })
              .then(function (newUser) {
                return res.status(201).json({
                  userId: newUser.id,
                });
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "ajout utilisateur impossible" });
              });
          });
        } else {
          return res.status(409).json({ error: "utilisateur déjà existant" });
        }
      })
      .catch(function (err) {
        return res
          .status(500)
          .json({ error: "impossible de vérifier utilisateur" });
      });
  },
  login: function (req, res) {
    // Params
    let email = req.body.email;
    let password = req.body.password;

    if (email == null || password == null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }
    // TODO: To implement
    models.User.findOne({
      where: { email: email },
    })
      .then(function (userFound) {
        if (userFound) {
          bcrypt.compare(
            password,
            userFound.password,
            function (errBycrypt, resBycrypt) {
              if (resBycrypt) {
                return res.status(200).json({
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
                return res.status(403).json({ error: "mot de passe invalide" });
              }
            }
          );
        } else {
          return res
            .status(404)
            .json({ error: "utilisateur inexistant dans la base de donnée" });
        }
      })
      .catch(function (err) {
        return res
          .status(500)
          .json({ error: "impossible de vérifier utilisateur" });
      });
  },
};
