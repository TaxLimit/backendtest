import { DataTypes } from "sequelize";
import sequelize from "../dbConnection.mjs";
import author from "./authorModel.mjs";

const book = sequelize.define(
  "book",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: author,
        key: "id",
      },
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

// book.sync({
//   force: true,
// });

export default book;
