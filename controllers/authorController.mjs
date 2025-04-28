import author from "../models/authorModel.mjs";
import sequelize from "../dbConnection.mjs";

// ALL AUTHORS

export const getAllAuthors = async (req, res) => {
  try {
    const getAuthors = await author.findAll();

    res.status(200).json({
      status: "Success",
      message: "Gotten all authors successfully",
      data: getAuthors,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "Failed to get authors",
      error: error.message,
    });
  }
};

//  AUTHOR BY ID

export const getAuthorByID = async (req, res) => {
  try {
    const getAuthorByID = await author.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Successfully gotten author",
      data: getAuthorByID,
    });
  } catch (error) {
    console.error("Database error in getAuthorByID:", error);
    throw error;
  }
};

export const createAuthor = async (req, res) => {
  try {
    const postauthor = await author.create(
      {
        name: req.body.name,
        birthDate: req.body.birthDate,
      },
      {
        fields: ["id", "name", "birthDate", "biography"],
      }
    );
    res.status(201).json({
      status: "Success",
      message: "author created successfully",
      data: postauthor,
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "Failed to create author",
      error: error.message,
    });
  }
};

export const updateAuthor = async (req, res) => {
  const editauthor = await author.update(
    {
      name: req.body.name,
      birthDate: req.body.birthdate,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  if (!editauthor || editauthor[0] === 0) {
    return console.log(
      `No author data changed, something wrong with controller or author not found`
    );
  } else {
    console.log(`Successfully edited author`);
  }
  try {
    res.status(200).json({
      status: "Success",
      message: "Edited author successfully",
      data: { affectedRows: editauthor[0] },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteAuthor = async (req, res) => {
  const deleteOneauthor = await author.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!deleteOneauthor || deleteOneauthor === 0) {
    return console.log(
      `No author deleted, something wrong with controller or author not found`
    );
  } else {
    console.log(`Successfully deleted author`);
  }
  try {
    res.status(204).json({
      status: "Success",
      message: "Deleted author successfully",
      data: null,
    });
  } catch (error) {
    console.log(error.message);
  }
};
