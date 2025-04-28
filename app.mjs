import express from "express";
import bookRouter from "./routes/bookRouter.mjs";
import userRouter from "./routes/userRouter.mjs";
import AppError from "./utils/appError.mjs";
import cors from "cors";
import cookieParser from "cookie-parser";
import authorRouter from "./routes/authorRouter.mjs";

const app = express();

// parse body
app.use(express.json());

// Add cookie parser
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/auth", userRouter);
app.use(`/books`, bookRouter);
app.use("/authors", authorRouter);

app.all("*", (req, res, next) => {
  //naudosime sukurtą AppError klasę
  const err = new AppError(`Cant find ${req.originalUrl} on this server!`, 404);

  //express žino pats, kad tai yra klaida ir ją perduoda centrinei klaidų valdymo funkcijai
  next(err);
});

export default app;
