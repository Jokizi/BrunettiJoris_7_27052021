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
            token: jwt.sign(
              { userId: newUser.id, isAdmin: newUser.isAdmin },
              process.env.TOKEN,
              { expiresIn: "24h" }
            ),
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
          console.log("---------------user---------------------");
          console.log(user);
          console.log("------------------------------------");
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
  deleteUser: function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN); // lien avec fichier .env
    const userId = decodedToken.userId;
    const messageId = parseInt(req.params.messageId);
    const commentId = parseInt(req.params.commentId);

    asyncLib.waterfall([
      function (done) {
        models.Message.findAll({
          where: { userId },
          attributes: ["id"],
        })
          .then(function (allMessagesUser) {
            let messageUserIds = [];

            allMessagesUser.map(({ id }) => {
              messageUserIds.push(id);
            });
            done(null, messageUserIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "1 vérification messages de l'user ID impossible",
            });
          });
      },
      function (messageUserIds, done) {
        models.Like.findAll({
          where: { messageId: messageUserIds },
          attributes: ["id"],
        })
          .then(function (allLikeMessagesUser) {
            let likeMessagesUserIds = [];

            allLikeMessagesUser.map(({ id }) => {
              likeMessagesUserIds.push(id);
            });
            done(null, messageUserIds, likeMessagesUserIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "2 vérification likes des messages ID impossible",
            });
          });
      },
      function (messageUserIds, likeMessagesUserIds, done) {
        models.Comment.findAll({
          where: { messageId: messageUserIds },
          attributes: ["id"],
        })
          .then(function (allCommentMessagesUser) {
            let commentMessagesUserIds = [];

            allCommentMessagesUser.map(({ id }) => {
              commentMessagesUserIds.push(id);
            });
            done(
              null,
              messageUserIds,
              likeMessagesUserIds,
              commentMessagesUserIds
            );
          })
          .catch(function (err) {
            res.status(500).json({
              error: "3 vérification commentaires des messages ID impossible",
            });
          });
      },
      function (
        messageUserIds,
        likeMessagesUserIds,
        commentMessagesUserIds,
        done
      ) {
        models.CommentsLike.findAll({
          where: { commentId: commentMessagesUserIds },
          attributes: ["id"],
        })
          .then(function (allCommentsLikeMessagesUser) {
            let commentsLikeMessagesUserIds = [];

            allCommentsLikeMessagesUser.map(({ id }) => {
              commentsLikeMessagesUserIds.push(id);
            });
            done(
              null,
              messageUserIds,
              likeMessagesUserIds,
              commentMessagesUserIds,
              commentsLikeMessagesUserIds
            );
          })
          .catch(function (err) {
            res.status(500).json({
              error:
                "4 vérification commentaireLikes des commentaires ID impossible",
            });
          });
      },
      function (
        messageUserIds,
        likeMessagesUserIds,
        commentMessagesUserIds,
        commentsLikeMessagesUserIds,
        done
      ) {
        models.CommentsLike.destroy({
          where: { id: commentsLikeMessagesUserIds },
        })
          .then(function () {
            models.Like.destroy({
              where: { id: likeMessagesUserIds },
            });
          })
          .then(function () {
            models.Comment.destroy({
              where: { id: commentMessagesUserIds },
            });
          })
          .then(function () {
            models.Message.destroy({
              where: { id: messageUserIds },
            });
            done(null);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "5 impossible de supprimer ces éléments",
            });
          });
      },

      /*===========================================================================*/
      function (done) {
        models.Comment.findAll({
          where: { userId },
          attributes: ["id", "messageId"],
        })
          .then(function (commentUserFound) {
            let commentUserIds = [];
            let commentMessageIds = [];

            commentUserFound.map((element) => {
              commentUserIds.push(element.id);
              commentMessageIds.push(element.messageId);
            });
            done(null, commentUserIds, commentMessageIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "6 vérification des commentaires impossible",
            });
          });
      },

      /*====================================================================*/
      function (commentUserIds, commentMessageIds, done) {
        models.Message.findAll({
          where: { id: commentUserIds },
        })
          .then(function (messageFound) {
            done(null, commentUserIds, commentMessageIds, messageFound);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "7 vérification des messages impossible",
            });
          });
      },

      /*==========================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.CommentsLike.findAll({
          where: { userId, userLike: true },
          attributes: ["commentId"],
        })
          .then((commentsLikeUserFound) => {
            let messageIdCommentsLikeUser = [];
            commentsLikeUserFound.map(({ commentId }) => {
              messageIdCommentsLikeUser.push(commentId);
            });
            messageIdCommentsLikeUser.map((element) => {
              console.log("------------------------------------");
              console.log(element);
              console.log("------------------------------------");
              models.Comment.update(
                {
                  commentLikes: models.Comment.commentLikes - 1,
                },
                {
                  where: { id: element },
                }
              );
            });
          })
          .then(() => {
            models.CommentsLike.destroy({
              where: { userId, userLike: true },
            });
            done(null, commentUserIds, commentMessageIds, messageFound);
          });
      },

      /*=============================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.CommentsLike.findAll({
          where: { userId, userDislike: true },
          attributes: ["commentId"],
        })
          .then((commentsLikeUserFound) => {
            let messageIdCommentsLikeUser = [];
            commentsLikeUserFound.map(({ commentId }) => {
              messageIdCommentsLikeUser.push(commentId);
            });
            messageIdCommentsLikeUser.map((element) => {
              models.Comment.update(
                {
                  commentDislikes: models.Comment.commentDislikes - 1,
                },
                {
                  where: { id: element },
                }
              );
            });
          })
          .then(() => {
            models.CommentsLike.destroy({
              where: { userId, userDislike: true },
            });
            done(null, commentUserIds, commentMessageIds, messageFound);
          });
      },

      /*==============================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.CommentsLike.destroy({
          where: { commentId: commentUserIds },
        }).then(() => {
          done(null, commentUserIds, commentMessageIds, messageFound);
        });
      },
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.CommentsLike.destroy({
          where: { userId },
        }).then(() => {
          done(null, commentUserIds, commentMessageIds, messageFound);
        });
      },

      /*============================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.Like.findAll({
          where: { userId, userLike: true },
          attributes: ["messageId"],
        })
          .then((likeUserFound) => {
            let messageIdLikeUser = [];
            likeUserFound.map(({ messageId }) => {
              messageIdLikeUser.push(messageId);
            });
            messageIdLikeUser.map((element) => {
              models.Message.update(
                {
                  likes: models.Message.likes - 1,
                },
                {
                  where: { id: element },
                }
              );
            });
          })

          .then(() => {
            models.Like.destroy({
              where: { userId, userLike: true },
            });
            done(null, commentUserIds, commentMessageIds, messageFound);
          });
      },

      /*===========================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.Like.findAll({
          where: { userId, userDislike: true },
          attributes: ["messageId"],
        })
          .then((likeUserFound) => {
            let messageIdLikeUser = [];
            likeUserFound.map(({ messageId }) => {
              messageIdLikeUser.push(messageId);
            });
            messageIdLikeUser.map((element) => {
              models.Message.update(
                {
                  dislikes: models.Message.dislikes - 1,
                },
                {
                  where: { id: element },
                }
              );
            });
          })
          .then(() => {
            models.Like.destroy({
              where: { userId, userDislike: true },
            });
            done(null, commentUserIds, commentMessageIds, messageFound);
          });
      },

      /*===========================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.Like.destroy({
          where: { userId },
        }).then(() => {
          done(null, commentUserIds, commentMessageIds, messageFound);
        });
      },

      /*====================================================================================*/
      function (commentUserIds, commentMessageIds, messageFound, done) {
        models.Message.findAll({
          where: { id: commentMessageIds },
        })
          .then(() => {
            commentMessageIds.map((element) => {
              models.Message.decrement(
                {
                  comments: 1,
                },
                {
                  where: { id: element },
                }
              );
            });
          })

          .then(() => {
            models.Comment.destroy({
              where: { userId: userId },
            });
            done(null);
          })
          .catch(function (err) {
            res.status(500).json({
              error:
                "5 impossible de supprimer les commentaires like de l'user ID",
            });
          });
      },
      function (done) {
        models.User.destroy({
          where: { id: userId },
        })
          .then((userDestroy) => {
            if (userDestroy) {
              res.status(201).json("utilisateur supprimé");
            } else {
              res.status(501).json("utilisateur introuvable");
            }
          })
          .catch(function (err) {
            res.status(500).json("impossible de supprimé l'utilisateur");
          });
      },
      /*========================================================================================================================*/
      /*function (done) {
        models.CommentsLike.findAll({
          where: { userId },
          attributes: ["id"],
        })
          .then(function (commentsLikeFound) {
            let commentsLikeIds = [];

            commentsLikeFound.map(({ id }) => {
              commentsLikeIds.push(id);
            });
            done(null, commentsLikeIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "1 vérification commentaireLike de l'user ID impossible",
            });
          });
      },
      function (commentsLikeIds, done) {
        models.CommentsLike.destroy({
          where: { id: commentsLikeIds },
        })
          .then(function () {
            done(null);
          })
          .catch(function (err) {
            res.status(500).json({
              error:
                "2 impossible de supprimer les commentaires like de l'user ID",
            });
          });
      },
      function (done) {
        models.Comment.findAll({
          where: { userId },
          attributes: ["id"],
        })
          .then(function (commentsFound) {
            let commentIds = [];

            commentsFound.map(({ id }) => {
              commentIds.push(id);
            });
            done(null, commentIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "3 vérification commentaire de l'user ID impossible",
            });
          });
      },
      function (commentIds, done) {
        models.CommentsLike.destroy({
          where: { commentId: commentIds },
        })
          .then(function () {
            done(null, commentIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "4 impossible de supprimer les commentaires like",
            });
          });
      },
      function (commentIds, done) {
        models.Comment.destroy({
          where: { id: commentIds },
        })
          .then(function () {
            done(null);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "5 impossible de supprimer les commentaires like",
            });
          });
      },
      function (done) {
        models.Like.findAll({
          where: { userId },
          attributes: ["id"],
        })
          .then(function (likeFound) {
            let likeIds = [];

            likeFound.map(({ id }) => {
              likeIds.push(id);
            });
            done(null, likeIds);
          })
          .catch(function (err) {
            res
              .status(500)
              .json({ error: "6 vérification commentaire impossible" });
          });
      },
      function (likeIds, done) {
        models.Like.destroy({
          where: { id: likeIds },
        })
          .then(function () {
            done(null);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "7 impossible de supprimer les commentaires like",
            });
          });
      },
      function (done) {
        models.Message.findAll({
          where: { userId },
          attributes: ["id"],
        })
          .then(function (messagesFound) {
            let messageIds = [];

            messagesFound.map(({ id }) => {
              messageIds.push(id);
            });
            done(null, messageIds);
          })
          .catch(function (err) {
            res
              .status(500)
              .json({ error: "8 vérification commentaire impossible" });
          });
      },
      function (messageIds, done) {
        models.Like.destroy({
          where: { messageId: messageIds },
        })
          .then(function () {
            done(null, messageIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "9 impossible de supprimer les commentaires like",
            });
          });
      },
      function (messageIds, done) {
        models.CommentsLike.destroy({
          where: { commentId: messageIds },
        })
          .then(function () {
            done(null, messageIds);
          })
          .catch(function (err) {
            console.log("--------------err à 10----------------------");
            console.log(err);
            console.log("------------------------------------");
            res.status(500).json({
              error: "10 impossible de supprimer les commentaires like",
            });
          });
      },
      function (messageIds, done) {
        models.Comment.destroy({
          where: { messageId: messageIds },
        })
          .then(function () {
            done(null, messageIds);
          })
          .catch(function (err) {
            res.status(500).json({
              error: "11 impossible de supprimer les commentaires like",
            });
          });
      },
      function (messageIds, done) {
        console.log("---------------messIDS---------------------");
        console.log(messageIds);
        console.log("------------------------------------");
        models.Message.destroy({
          where: { id: messageIds },
        })
          .then(function () (destroyMessagesFound) {
            //return res.status(201).json(destroyMessagesFound);
            done(null, messageIds);
          })
          .catch(function (err) {
            console.log("------------------------------------");
            console.log(err);
            console.log("------------------------------------");
            res
              .status(500)
              .json({ error: "12 impossible de supprimer la publication" });
          });
      },
      function (messageIds, done) {
        models.Message.findAll({
          attributes: ["id"],
        }).then(function (allMessagesNoUser) {
          console.log("--------------allmessause----------------------");
          console.log(allMessagesNoUser);
          console.log("------------------------------------");
        });
      },*/

      /*function (done) {
        models.Comment.destroy({
          where: { commentId: commentIds },
        })
          .then(() => {
            models.Like.destroy({
              where: { messageId: messageId },
            });
            done(null);
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "impossible de supprimer les commentaires" });
          });
      },*/
      /*function (done) {
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
        models.Message.findAll({
          where: { userId },
        })
          .then(function () {
            done(messagesFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "publications de l'utilisateur introuvable" });
          });
        }
      },
      function (done) {
        models.Like.findAll({
          where: { userId },
        })
          .then(function () {
            done(likesFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "likes de l'utilisateur introuvable" });
          });
      },
      function (done) {
        models.Comment.findAll({
          where: { userId },
        })
          .then(function () {
            done(commentsFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "commentaires de l'utilisateur introuvable" });
          });
      },
      function (done) {
        models.CommentsLike.findAll({
          where: { userId },
        })
          .then(function () {
            done(commentsLikeFound);
          })
          .catch(function (err) {
            return res.status(500).json({
              error: "likes commentaires de l'utilisateur introuvable",
            });
          });
      },*/
    ]);
  },
};
