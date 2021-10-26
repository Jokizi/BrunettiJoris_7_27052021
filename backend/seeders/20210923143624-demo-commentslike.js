"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("CommentsLikes", [
      {
        id: 1,
        commentId: 6,
        userId: 3,
        userLike: 0,
        userDislike: 1,
        createdAt: "2021-09-23 14:33:11",
        updatedAt: "2021-09-23 14:33:11",
      },
      {
        id: 2,
        commentId: 8,
        userId: 3,
        userLike: 1,
        userDislike: 0,
        createdAt: "2021-09-23 14:33:37",
        updatedAt: "2021-09-23 14:33:37",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("CommentsLikes", null, {});
  },
};
