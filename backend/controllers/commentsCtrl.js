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
  listComments: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const messageId = parseInt(req.params.messageId);

    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const ITEMS_LIMIT = 50;
    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }
    models.Comment.findAll({
      where: { messageId },
      order: [order != null ? order.split(":") : ["createdAt", "ASC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      limit: !isNaN(limit) ? limit : null,
      offset: !isNaN(offset) ? offset : null,
      include: [
        {
          model: models.User,
          attributes: ["username"],
        },
      ],
    })
      .then(function (messages) {
        if (messages) {
          res.status(200).json(messages);
        } else {
          res.status(404).json({ error: "no messages found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },
  updateComment: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres

    const content = req.body.content;
    // const messageId = parseInt(req.params.messageId);
    const commentId = parseInt(req.params.commentId);

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
            models.Comment.findOne({
              where: { id: commentId, userId },
            })
              .then(function (commentFound) {
                done(null, commentFound);
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "commentaire introuvable" });
              });
          } else {
            return res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
        function (commentFound, done) {
          if (commentFound) {
            commentFound
              .update({
                content: content ? content : comment.content,
              })
              .then(function (newCommentFound) {
                done(newCommentFound);
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (commentFound) {
        if (commentFound) {
          return res.status(201).json(commentFound);
        } else {
          return res
            .status(500)
            .json({ error: "publication commentaire impossible" });
        }
      }
    );
  },
};
