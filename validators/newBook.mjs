import { body } from "express-validator";

const validateNewbook = [
  // Check if body is not empty
  body().notEmpty().withMessage("Request body must contain data"),

  // validate name

  body("fullname")
    .isString()
    .withMessage("Full Name must be a string")
    .isLength({ min: 7, max: 100 })
    .withMessage("Name must be between 3 and 100 characters")
    .notEmpty()
    .withMessage("Name is required"),

  body("amount")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .notEmpty()
    .withMessage("Price is required")
    .toFloat(),

  body("status")
    .isString()
    .withMessage("Full Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
];

export default validateNewbook;
