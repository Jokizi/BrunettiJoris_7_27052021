"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Comments", [
      {
        id: 1,
        messageId: 1,
        userId: 2,
        content: "Je n'approuve pas tes manières d'agir !",
        commentLikes: 0,
        commentDislikes: 0,
        createdAt: "2021-09-23 12:52:23",
        updatedAt: "2021-09-23 13:07:22",
      },
      {
        id: 2,
        messageId: 2,
        userId: 3,
        content: "Il a prit un coup de vieux Néo.",
        commentLikes: 0,
        commentDislikes: 0,
        createdAt: "2021-09-23 12:57:04",
        updatedAt: "2021-09-23 13:09:03",
      },
      {
        id: 3,
        messageId: 1,
        userId: 3,
        content: "Il est trop mignon, ( je parles du chat ) ! ",
        commentLikes: 0,
        commentDislikes: 0,
        createdAt: "2021-09-23 12:58:36",
        updatedAt: "2021-09-23 12:58:36",
      },
      {
        id: 4,
        messageId: 1,
        userId: 4,
        content: "Le côté obscur de la force !",
        commentLikes: 0,
        commentDislikes: 0,
        createdAt: "2021-09-23 13:08:23",
        updatedAt: "2021-09-23 13:08:23",
      },
      {
        id: 5,
        messageId: 2,
        userId: 4,
        content: "Dans ma jeunesse, j'étais moi même l'élu, faut dire que ça ne m'a pas réussi !",
        commentLikes: 0,
        commentDislikes: 0,
        createdAt: "2021-09-23 13:10:26",
        updatedAt: "2021-09-23 13:10:26",
      },
      {
        id: 6,
        messageId: 3,
        userId: 4,
        content: "Je me demandes si vous feriez le poids contre les jedis ?!",
        commentLikes: 0,
        commentDislikes: 1,
        createdAt: "2021-09-23 13:11:31",
        updatedAt: "2021-09-23 13:13:10",
      },
      {
        id: 7,
        messageId: 4,
        userId: 3,
        content: "On va envoyer SuperMan te rendre visite ...",
        commentLikes: 0,
        commentDislikes: 0,
        createdAt: "2021-09-23 13:12:49",
        updatedAt: "2021-09-23 13:12:49",
      },
      {
        id: 8,
        messageId: 3,
        userId: 3,
        content: "De toutes manières eux comme nous, oeuvrons pour le Bien !",
        commentLikes: 1,
        commentDislikes: 0,
        createdAt: "2021-09-23 13:13:42",
        updatedAt: "2021-09-23 13:13:42",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Comments", null, {});
  },
};
