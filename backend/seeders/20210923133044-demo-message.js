"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Messages", [
      {
        id: 1,
        userId: 1,
        title: "Je vous présente mon chat ",
        content: "J'adore cet animal",
        attachment: "http://localhost:8080/images/image_gglW9NUNkqUI1BPPlpgKE.gif",
        likes: 1,
        dislikes: 2,
        comments: 3,
        createdAt: "2021-09-23 12:38:11",
        updatedAt: "2021-09-23 13:08:23",
      },
      {
        id: 2,
        userId: 2,
        title: "On me dit souvent qu'il me ressemble",
        content: "Encore un qui se prend pour l'élu !",
        attachment: "http://localhost:8080/images/image_CL3LerhHpEwTQLOiKGQ-y.jpg",
        likes: 1,
        dislikes: 0,
        comments: 2,
        createdAt: "2021-09-23 12:51:02",
        updatedAt: "2021-09-23 13:10:26",
      },
      {
        id: 3,
        userId: 3,
        title: "Ma Justice League",
        content: "Attention à l'équipe de choc !",
        attachment: "http://localhost:8080/images/image_9_XA1ZqYMmy3e4_2agZBt.jpg",
        likes: 0,
        dislikes: 1,
        comments: 2,
        createdAt: "2021-09-23 12:55:16",
        updatedAt: "2021-09-23 13:13:42",
      },
      {
        id: 4,
        userId: 4,
        title: "Voici l'étoile noire",
        content: "Les frais de rénovation vont dépasser le budget . . .",
        attachment: "http://localhost:8080/images/image_ppzpaRWkEFqn_T1h8NAJG.jpg",
        likes: 0,
        dislikes: 1,
        comments: 1,
        createdAt: "2021-09-23 13:06:56",
        updatedAt: "2021-09-23 13:12:49",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Messages", null, {});
  },
};
