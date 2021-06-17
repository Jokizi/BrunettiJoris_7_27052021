"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentsLikes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Comment, {
        foreignKey: "commentId",
      }),
        this.belongsTo(models.User, {
          foreignKey: "userId",
        });
    }
  }
  CommentsLikes.init(
    {
      commentId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      userLike: DataTypes.BOOLEAN,
      userDislike: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "CommentsLikes",
    }
  );
  return CommentsLikes;
};
