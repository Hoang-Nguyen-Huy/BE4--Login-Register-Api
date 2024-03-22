const User = require("../models/user.model");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.update = async (req, res) => {
  const { lname, fname, age, email, avt } = req.body;

  const updateUserDetail = await User.findUserDetailByEmail(email);

  if (!updateUserDetail) {
    return res.status(500).json({ message: "Error updating user detail" });
  } else {
    const updateUser = await User.findByUserId(updateUserDetail.userid);

    if (!updateUser) {
      return res.status(500).json({ message: "Error updating user detail" });
    } else {
      User.updateUserDetail(
        updateUser.userid,
        { lname, fname, age, email, avt },
        (err, updated) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error updating user detail" });
          }
          const responseData = {
            id: updateUser.userid,
            username: updateUser.username,
            role: updateUser.role,
            detail: updated,
          };
          
          delete updated.userid;

          res.status(200).json(responseData);
        }
      );
    }
  }
};

exports.getAll = async (req, res) => {
  const { page, take } = req.query;

  if (!take || isNaN(parseInt(take))) {
    return res.status(400).json({ message: "take parameter is missing or invalid" });
  }

  // Calculating offset is just to get data from the page and how much to get
  const offset = (page - 1) * take;

  try {
    const userDetails = await User.getAllUserDetail(offset, take);

    // Number of records queried
    const totalRecord = await prisma.userDetail.count();

    // Calculating numbers of needing page
    const totalPage = Math.ceil(totalRecord / take);

    // Determine the previous page
    const prevPage = parseInt(page) > 1 ? parseInt(page) - 1 : null;

    // Determine the next page
    const nextPage = parseInt(page) < totalPage ? parseInt(page) + 1 : null;

    const responseData = {
      page: parseInt(page),
      take: parseInt(take),
      data: userDetails,
      totalRecord: totalRecord,
      totalPage: totalPage,
    };

    if (nextPage !== null) {
      responseData.nextPage = nextPage;
    }

    if (prevPage !== null) {
      responseData.prevPage = prevPage;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user details: ", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
};
