// Imports
const models = require("../models");
const jwt = require("jsonwebtoken");
const asyncLib = require("async");

// Routes
module.exports = {
  likePost: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres
    const messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
        // on cherche la publication rapport à son id
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (messageFound, done) {
        // on cherche l'utilisateur rapport à son id
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        } else {
          return res.status(404).json({ error: "post already liked" });
        }
      },
      function (messageFound, userFound, done) {
        // si le user et le message sont présents dans la table like
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, messageFound, userFound, userAlreadyLikedFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify is user already liked" });
            });
        } else {
          return res.status(404).json({ error: "user not exist" });
        }
      },
      function (messageFound, userFound, userAlreadyLikedFound, done) {
        // si l'user n'est pas présent dans la table like on l'a crée
        if (!userAlreadyLikedFound) {
          models.Like.create({
            userLike: true,
            userDislike: false,
            messageId,
            userId,
          }),
            messageFound
              .update({
                likes: messageFound.likes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, messageFound, userFound);
                return res.status(201).json("like ajouté");
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "unable to set user reaction" });
              });
        } else {
          // si il n'a pas déja liker et disliker
          if (
            !userAlreadyLikedFound.userLike &&
            !userAlreadyLikedFound.userDislike
          ) {
            userAlreadyLikedFound.update({
              userLike: true,
            }),
              messageFound
                .update({
                  likes: messageFound.likes + 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("like ajouté");
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
            // si il a déjà disliké
          } else if (
            userAlreadyLikedFound.userLike === false &&
            userAlreadyLikedFound.userDislike === true
          ) {
            userAlreadyLikedFound.update({
              userDislike: false,
              userLike: true,
            }),
              messageFound
                .update({
                  likes: messageFound.likes + 1,
                  dislikes: messageFound.dislikes - 1, // = messageFound.dislikes -1
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("dislike retirée, like ajouté");
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
            // si il à déjà liké
          } else if (
            userAlreadyLikedFound.userLike === true &&
            userAlreadyLikedFound.userDislike === false
          ) {
            userAlreadyLikedFound.update({
              userLike: false,
            }),
              messageFound
                .update({
                  likes: messageFound.likes - 1, //=  messageFound.likes - 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  return res.status(201).json("like retirée");
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
          } else {
            return res.status(409).json({ error: "message already disliked" });
          }
        }
      },
    ]);
  },
  dislikePost: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres
    const messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Message.findOne({
          where: { id: messageId },
        })
          .then(function (messageFound) {
            done(null, messageFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (messageFound, done) {
        if (messageFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, messageFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        } else {
          res.status(404).json({ error: "post already liked" });
        }
      },
      function (messageFound, userFound, done) {
        if (userFound) {
          models.Like.findOne({
            where: {
              userId: userId,
              messageId: messageId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, messageFound, userFound, userAlreadyLikedFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify is user already liked" });
            });
        } else {
          res.status(404).json({ error: "user not exist" });
        }
      },
      function (messageFound, userFound, userAlreadyLikedFound, done) {
        if (!userAlreadyLikedFound) {
          models.Like.create({
            userLike: false,
            userDislike: true,
            messageId,
            userId,
          }),
            messageFound
              .update({
                dislikes: messageFound.dislikes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, messageFound, userFound);
                res.status(201).json("dislike ajouté");
              })
              .catch(function (err) {
                return res
                  .status(500)
                  .json({ error: "unable to set user reaction" });
              });
        } else {
          if (
            userAlreadyLikedFound.userLike === false &&
            userAlreadyLikedFound.userDislike === false
          ) {
            userAlreadyLikedFound.update({
              userDislike: true,
            }),
              messageFound
                .update({
                  dislikes: messageFound.dislikes + 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  res.status(201).json("dislike ajouté");
                })
                .catch(function (err) {
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
          } else if (
            userAlreadyLikedFound.userLike === true &&
            userAlreadyLikedFound.userDislike === false
          ) {
            userAlreadyLikedFound.update({
              userDislike: true,
              userLike: false,
            }),
              messageFound
                .update({
                  dislikes: messageFound.dislikes + 1,
                  likes: messageFound.likes - 1, // = messageFound.likes -1
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  res.status(201).json("like retiré ,dislike ajouté");
                })
                .catch(function (err) {
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
          } else if (
            userAlreadyLikedFound.userLike === false &&
            userAlreadyLikedFound.userDislike === true
          ) {
            userAlreadyLikedFound.update({
              userDislike: false,
            }),
              messageFound
                .update({
                  dislikes: messageFound.dislikes - 1, // =  messageFound.dislikes - 1,
                })
                .then(function () {
                  done(null, messageFound, userFound);
                  res.status(201).json("dislike retirée");
                })
                .catch(function (err) {
                  res
                    .status(500)
                    .json({ error: "cannot update user reaction" });
                });
          } else {
            res.status(409).json({ error: "message already disliked" });
          }
        }
      },
    ]);
  },
};