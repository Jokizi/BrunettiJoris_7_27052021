// Imports
const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");

module.exports = {
  createComment: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres

    const content = req.body.content;
    const messageId = parseInt(req.params.messageId);

    asyncLib.waterfall(
      [
        function (done) {
          models.User.findOne({
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
            models.Message.findOne({
              where: { id: messageId },
            })
              .then(function (messageFound) {
                done(null, messageFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "message introuvable" });
              });
          } else {
            return res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
        function (messageFound, userFound, done) {
          if (messageFound) {
            models.Comment.create({
              content: content,
              commentLikes: 0,
              commentDislikes: 0,
              UserId: userFound.id,
              MessageId: messageFound.id,
            }),
              messageFound
                .update({
                  comments: messageFound.comments + 1,
                })
                .then(function (newComment) {
                  done(newComment);
                });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newComment) {
        if (newComment) {
          return res.status(201).json(newComment);
        } else {
          return res
            .status(500)
            .json({ error: "publication commentaire impossible" });
        }
      }
    );
  },
};
