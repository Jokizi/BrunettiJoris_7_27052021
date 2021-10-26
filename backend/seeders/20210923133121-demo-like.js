"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Likes", [
      {
        id: 1,
        messageId: 1,
        userId: 2,
        userLike: 0,
        userDislike: 1,
        createdAt: "2021-09-23 12:51:51",
        updatedAt: "2021-09-23 12:51:51",
      },
      {
        id: 2,
        messageId: 2,
        userId: 3,
        userLike: 1,
        userDislike: 0,
        createdAt: "2021-09-23 12:55:32",
        updatedAt: "2021-09-23 12:55:32",
      },
      {
        id: 3,
        messageId: 1,
        userId: 3,
        userLike: 0,
        userDislike: 1,
        createdAt: "2021-09-23 12:57:21",
        updatedAt: "2021-09-23 12:57:21",
      },
      {
        id: 4,
        messageId: 1,
        userId: 4,
        userLike: 1,
        userDislike: 0,
        createdAt: "2021-09-23 13:07:14",
        updatedAt: "2021-09-23 13:07:14",
      },
      {
        id: 5,
        messageId: 3,
        userId: 4,
        userLike: 0,
        userDislike: 1,
        createdAt: "2021-09-23 13:08:51",
        updatedAt: "2021-09-23 13:08:51",
      },
      {
        id: 6,
        messageId: 4,
        userId: 3,
        userLike: 0,
        userDislike: 1,
        createdAt: "2021-09-23 13:12:14",
        updatedAt: "2021-09-23 13:12:14",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Likes", null, {});
  },
};
