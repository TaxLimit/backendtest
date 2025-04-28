import book from "../models/bookModel.mjs";
import sequelize from "../dbConnection.mjs";

export const getAllbooks = async (req, res) => {
  try {
    let currentPage = req.query.page;
    let pageSize = req.query.limit;
    const options = {
      where: {},
      order: [],
      offset: parseInt((currentPage - 1) * pageSize, 10),
      pageSize: { limit: req.query.limit },
    };
    // if (req.query.title) {
    //   options.where = {
    //     title: sequelize.fn("LOCATE", sequelize.col("title"), req.query.title),
    //   };
    // }
    if (req.query.authorid) {
      options.where = { authorId: req.query.authorid };
    }

    const { count, rows } = await book.findAndCountAll(options);

    res.status(200).json({
      status: "Success",
      message: "Gotten all books successfully",
      currentPage: currentPage,
      pageSize: options.pageSize,
      data: { count, rows },
    });
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "Failed to get books",
      error: error.message,
    });
  }
};

//  get book by id

export const getBookByID = async (req, res) => {
  try {
    const getBookByID = await book.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Successfully gotten author",
      data: getBookByID,
    });
  } catch (error) {
    console.error("Database error in getBookByID:", error);
    throw error;
  }
};

// generate unique book ID
const generateUniquebookId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let characters = "";
  for (let i = 0; i < 2; i++) {
    characters += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  let numbers = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return characters + numbers;
};

export const createbook = async (req, res) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 90);

    const postbook = await book.create(
      {
        id: generateUniquebookId(),
        fullname: req.body.fullname,
        amount: req.body.amount,
        duedate: dueDate,
        status: req.body.status,
        ownerid: req.user.id,
      },
      {
        fields: ["id", "fullname", "amount", "duedate", "status", "ownerid"],
      }
    );
    res.status(201).json({
      status: "Success",
      message: "book created successfully",
      data: postbook,
    });
    res.status(201)
      ? console.log("Success, book created!")
      : console.log("Failed to create book");
  } catch (error) {
    res.status(500).json({
      status: "Fail",
      message: "Failed to create book",
      error: error.message,
    });
  }
};

export const updatebook = async (req, res) => {
  const editbook = await book.update(
    {
      fullname: req.body.fullname,
      amount: req.body.amount,
      duedate: req.body.duedate,
      status: req.body.status,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  if (!editbook || editbook[0] === 0) {
    return console.log(
      `No book data changed, something wrong with controller or book not found`
    );
  } else {
    console.log(`Successfully edited book`);
  }
  try {
    res.status(200).json({
      status: "Success",
      message: "Edited book successfully",
      data: { affectedRows: editbook[0] },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletebook = async (req, res) => {
  const deleteOnebook = await book.destroy({
    where: {
      id: req.params.id,
    },
  });
  if (!deleteOnebook || deleteOnebook === 0) {
    return console.log(
      `No book deleted, something wrong with controller or book not found`
    );
  } else {
    console.log(`Successfully deleted book`);
  }
  try {
    res.status(204).json({
      status: "Success",
      message: "Deleted book successfully",
      data: null,
    });
  } catch (error) {
    console.log(error.message);
  }
};
