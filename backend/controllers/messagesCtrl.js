// Imports
const models = require("../models");
const asyncLib = require("async");
const jwt = require("jsonwebtoken");

// Constantes
const title_limit = 2;
const content_limit = 4;
const items_limit = 50;

module.exports = {
  createMessageImage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    // Paramètres
    const title = req.body.title;
    const content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    if (title.length <= title_limit || content.length <= content_limit) {
      return res.status(400).json({ error: "publication insuffisante" });
    }

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
            models.Message.create({
              title: title,
              content: content,
              likes: 0,
              dislikes: 0,
              UserId: userFound.id,
              comments: 0,
              attachment: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          return res.status(201).json(newMessage);
        } else {
          return res
            .status(500)
            .json({ error: "publication message impossible" });
        }
      }
    );
  },
  createMessage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    // Paramètres
    const title = req.body.title;
    const content = req.body.content;

    if (title == null || content == null) {
      return res.status(400).json({ error: "champ(s) manquant(s)" });
    }

    if (title.length <= title_limit || content.length <= content_limit) {
      return res.status(400).json({ error: "publication insuffisante" });
    }

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
            models.Message.create({
              title: title,
              content: content,
              likes: 0,
              dislikes: 0,
              UserId: userFound.id,
              comments: 0,
            }).then(function (newMessage) {
              done(newMessage);
            });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (newMessage) {
        if (newMessage) {
          return res.status(201).json(newMessage);
        } else {
          return res
            .status(500)
            .json({ error: "publication message impossible" });
        }
      }
    );
  },
  listMessages: function (req, res) {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > items_limit) {
      limit = items_limit;
    }

    models.Message.findAll({
      order: [order != null ? order.split(":") : ["title", "ASC"]],
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
          res.status(404).json({ error: "message(s) introuvable(s)" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "colonne invalide" });
      });
  },
  listMessagesUser: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > items_limit) {
      limit = items_limit;
    }

    models.Message.findAll({
      where: { userId },
      order: [order != null ? order.split(":") : ["title", "ASC"]],
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
          res.status(404).json({ error: "message(s) introuvable(s)" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "colonne invalide" });
      });
  },
  getOneMessage: function (req, res) {
    const messageId = parseInt(req.params.messageId);
    models.Message.findOne({
      attributes: ["createdAt", "title", "attachment", "content"],
      where: { id: messageId },
      include: [
        {
          model: models.User,
          attributes: ["username"],
        },
      ],
    })
      .then(function (message) {
        if (message) {
          res.status(201).json(message);
        } else {
          res.status(404).json({ error: "message introuvable" });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "impossible de récupérer le message" });
      });
  },
  updateMessage: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;

    const title = req.body.title;
    const content = req.body.content;
    const messageId = parseInt(req.params.messageId);

    asyncLib.waterfall(
      [
        function (done) {
          models.Message.findOne({
            where: { id: messageId, userId },
          })
            .then(function (messageFound) {
              done(null, messageFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "message introuvable" });
            });
        },
        function (messageFound, done) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "vérification utilisateur impossible" });
            });
        },
        function (messageFound, userFound, done) {
          if (messageFound) {
            messageFound
              .update({
                title: title ? title : messageFound.title,
                content: content ? content : message.content,
              })
              .then(function (newMessageFound) {
                done(newMessageFound);
              });
          } else {
            res.status(404).json({ error: "utilisateur introuvable" });
          }
        },
      ],
      function (messageFound) {
        if (messageFound) {
          return res.status(201).json(messageFound);
        } else {
          return res
            .status(500)
            .json({ error: "publication commentaire impossible" });
        }
      }
    );
  },
};
