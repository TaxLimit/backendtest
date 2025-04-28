import argon2 from "argon2";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.mjs";
import {
  getUserByUsername,
  getUserByID,
  createUser,
} from "./userController.mjs";
import book from "../models/bookModel.mjs";

//  COOKIES / TOKENS / register / LOGIN / LOGOUT

//funkcija, kuri sugeneruoja jwt token, payload user.id
const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

//funkcija, kuri išsiunčia cookie į naršyklę (į front'ą)
const sendTokenCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
};

//1. user register

export const register = async (req, res, next) => {
  try {
    const newUser = req.body;
    const hash = await argon2.hash(newUser.password);

    newUser.password = hash;
    console.log(newUser);

    const createdUser = await createUser(newUser);

    if (!createdUser) {
      throw new AppError("User not Created", 400);
    }

    const { id } = createdUser;

    const token = signToken(id);
    console.log(token);

    sendTokenCookie(token, res);

    createdUser.password = undefined;

    res.status(201).json({
      status: "success",
      data: { userId: id },
    });
  } catch (error) {
    next(error);
  }
};

// user login

export const login = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await getUserByUsername(username);
    console.log(user);

    const token = signToken(user.id);
    sendTokenCookie(token, res);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      data: { userId: user.id },
    });
  } catch (error) {
    next(error);
  }
};

// protect route

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.jwt;

    if (!token) {
      throw new AppError(
        "You are not logged in. Please log in to get access",
        401
      );
    }

    //token verify

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //check if user still exists
    const currentUser = await getUserByID(decoded.id);
    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token does not longer exists"
      );
    }

    //grant access to protected route, add user to req object
    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const allowAccessTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        throw new AppError(
          "You dont have permissions to performs this actions",
          403
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Owner-based authorization for books
export const checkbookOwnership = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const bookId = req.params.id;

    if (!bookId) {
      return next(new AppError("book ID is missing in the request.", 400));
    }

    const foundbook = await book.findByPk(bookId);

    if (!foundbook) {
      return next(new AppError("No book found with that ID", 404));
    }

    if (foundbook.ownerid !== loggedInUserId) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return res.clearCookie("jwt").status(200).json({
    message: "You are logged out",
  });
};
