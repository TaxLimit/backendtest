import express from "express";

import {
  register,
  login,
  logout,
  protect,
} from "../controllers/authController.mjs";
import validateNewUser from "../validators/register.mjs";
import validate from "../validators/validate.mjs";
import validateLogin from "../validators/login.mjs";

const userRouter = express.Router();

userRouter.route("/register").post(validateNewUser, validate, register);
userRouter.route("/login").post(validateLogin, validate, login);
userRouter.route("/logout").get(protect, logout);

export default userRouter;
