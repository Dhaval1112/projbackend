const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // this will validate that password and email comes into parameter is valid
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    // if there is an error or user not found then execute it
    if (err || !user) {
      return res.status(400).json({
        error: `USER with  ${req.body.email}  is not exist`,
      });
    }

    // if user password does not authanticate means password of founded user
    //  does not match which is stored in database
    if (!user.authanticate(password)) {
      return res.status(401).json({
        error: `Email and password do not match`,
      });
    }

    // Create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    // send response to frontend so that also know
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      params: errors.array()[0].param,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in database ",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "signout successfully done from controller",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// Custome made middlewares

exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return status(403).json({
      error: "ACCESS DENIED",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, ACCESS DENIED",
    });
  }
  next();
};
