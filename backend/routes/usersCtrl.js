// Imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const models = require("../models");

// Routes
module.exports = {
  registrer: function (req, res) {
    // Params
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let bio = req.body.bio;

    if (email == null || username == null || password == null) {
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
                return res.status(500).json({ error: "ajout user impossible" });
              });
          });
        } else {
          return res.status(409).json({ error: "user déjà existant" });
        }
      })
      .catch(function (err) {
        return res.status(500).json({ error: "impossible de vérifier user" });
      });
  },
  login: function (req, res) {
    // TODO: To implement
  },
};
