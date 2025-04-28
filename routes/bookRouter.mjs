import express from "express";

import {
  getAllbooks,
  createbook,
  updatebook,
  deletebook,
  getBookByID,
} from "../controllers/bookController.mjs";

import { protect, allowAccessTo } from "../controllers/authController.mjs";

import validate from "../validators/validate.mjs";

const bookRouter = express.Router();

bookRouter.use(protect);

bookRouter
  .route("/")
  .get(getAllbooks)
  .post(allowAccessTo("admin"), validate, createbook);

bookRouter
  .route("/:id")
  .get(getBookByID)
  .patch(allowAccessTo("admin"), updatebook)
  .delete(allowAccessTo("admin"), deletebook);

export default bookRouter;
