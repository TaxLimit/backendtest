import express from "express";

import {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorByID,
} from "../controllers/authorController.mjs";

import { protect, allowAccessTo } from "../controllers/authController.mjs";

import validate from "../validators/validate.mjs";

const authorRouter = express.Router();

authorRouter.use(protect);

authorRouter
  .route("/")
  .get(getAllAuthors)
  .post(allowAccessTo("admin"), validate, createAuthor);

authorRouter
  .route("/:id")
  .get(getAuthorByID)
  .patch(allowAccessTo("admin"), updateAuthor)
  .delete(allowAccessTo("admin"), deleteAuthor);

export default authorRouter;
