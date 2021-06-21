// Imports
const models = require("../models");
const jwt = require("jsonwebtoken");
const asyncLib = require("async");

// Routes
module.exports = {
  commentLikePost: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres
    const commentId = parseInt(req.params.commentId);

    if (commentId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
        // on cherche la publication rapport à son id
        models.Comment.findOne({
          where: { id: commentId },
        })
          .then(function (commentFound) {
            done(null, commentFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (commentFound, done) {
        // on cherche l'utilisateur rapport à son id
        if (commentFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, commentFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        } else {
          return res.status(404).json({ error: "post already liked" });
        }
      },
      function (commentFound, userFound, done) {
        // si le user et le message sont présents dans la table like
        if (userFound) {
          models.CommentsLike.findOne({
            where: {
              userId: userId,
              commentId: commentId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, commentFound, userFound, userAlreadyLikedFound);
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
      function (commentFound, userFound, userAlreadyLikedFound, done) {
        // si l'user n'est pas présent dans la table like on l'a crée
        if (!userAlreadyLikedFound) {
          models.CommentsLike.create({
            userLike: true,
            userDislike: false,
            commentId,
            userId,
          }),
            commentFound
              .update({
                commentLikes: commentFound.commentLikes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, commentFound, userFound);
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
              commentFound
                .update({
                  commentLikes: commentFound.commentLikes + 1,
                })
                .then(function () {
                  done(null, commentFound, userFound);
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
              commentFound
                .update({
                  commentLikes: commentFound.commentLikes + 1,
                  commentDislikes: commentFound.commentDislikes - 1, // = messageFound.dislikes -1
                })
                .then(function () {
                  done(null, commentFound, userFound);
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
              commentFound
                .update({
                  commentLikes: commentFound.commentLikes - 1, //=  messageFound.likes - 1,
                })
                .then(function () {
                  done(null, commentFound, userFound);
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
  commentDislikePost: function (req, res) {
    // Getting auth header
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;

    // Paramètres
    const commentId = parseInt(req.params.commentId);

    if (commentId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall([
      function (done) {
        models.Comment.findOne({
          where: { id: commentId },
        })
          .then(function (commentFound) {
            done(null, commentFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      function (commentFound, done) {
        if (commentFound) {
          models.User.findOne({
            where: { id: userId },
          })
            .then(function (userFound) {
              done(null, commentFound, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: "unable to verify user" });
            });
        } else {
          res.status(404).json({ error: "post already liked" });
        }
      },
      function (commentFound, userFound, done) {
        if (userFound) {
          models.CommentsLike.findOne({
            where: {
              userId: userId,
              commentId: commentId,
            },
          })
            .then(function (userAlreadyLikedFound) {
              done(null, commentFound, userFound, userAlreadyLikedFound);
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
      function (commentFound, userFound, userAlreadyLikedFound, done) {
        if (!userAlreadyLikedFound) {
          models.CommentsLike.create({
            userLike: false,
            userDislike: true,
            commentId,
            userId,
          }),
            commentFound
              .update({
                commentDislikes: commentFound.commentDislikes + 1,
              })
              .then(function (alreadyLikeFound) {
                done(null, commentFound, userFound);
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
              commentFound
                .update({
                  commentDislikes: commentFound.commentDislikes + 1,
                })
                .then(function () {
                  done(null, commentFound, userFound);
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
              commentFound
                .update({
                  commentDislikes: commentFound.commentDislikes + 1,
                  commentLikes: commentFound.commentLikes - 1, // = messageFound.likes -1
                })
                .then(function () {
                  done(null, commentFound, userFound);
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
              commentFound
                .update({
                  commentDislikes: commentFound.commentDislikes - 1, // =  messageFound.dislikes - 1,
                })
                .then(function () {
                  done(null, commentFound, userFound);
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