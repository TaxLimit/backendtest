import argon2 from "argon2";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.mjs";
import sequelize from "../dbConnection.mjs";
import user from "../models/userModel.mjs";

// GET / CREATE USER

export const getUserByUsername = async (username) => {
  try {
    const getUserByUsername = await user.findOne({
      where: {
        username: username,
      },
    });
    return getUserByUsername;
  } catch (error) {
    console.error("Database error in getUserByUsername:", error);
    throw error;
  }
};

export const getUserByID = async (id) => {
  try {
    const getUserByID = await user.findOne({
      where: {
        id: id,
      },
    });
    return getUserByID;
  } catch (error) {
    console.error("Database error in getUserByID:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const newUser = await user.create(
    {
      username: userData.username,
      password: userData.password,
      role: userData.role || "user",
    },
    {
      fields: ["id", "username", "password", "role"],
    }
  );
  return newUser;
};
