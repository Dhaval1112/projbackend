const user = require("../models/user");

const getAllUsers = (req, res) => {
  user.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "Users not found",
      });
    }
    return res.send(users);
  });
};

module.exports = getAllUsers;
