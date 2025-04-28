import { body } from "express-validator";
import argon2 from "argon2";
import { getUserByUsername } from "../controllers/userController.mjs";

const validateLogin = [
  body().notEmpty().withMessage("User body must contain data"),

  body("username").trim(),

  body("password")
    .trim()
    .notEmpty()
    .custom(async (value, { req }) => {
      const user = await getUserByUsername(req.body.username);
      let matchPass = false;
      if (user) {
        matchPass = await argon2.verify(user.password, value);
      }
      if (!matchPass) {
        throw new Error("invalid username or password");
      }
      return true;
    }),
];

export default validateLogin;
