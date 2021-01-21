const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { signout, signup } = require("../controllers/auth");

router.post(
  "/signup",
  //   this is validation for parameters from express validator
  [
    check("name", "Name should be atleast 3 characters").isLength({ min: 3 }),
    check("email", "Please enter valid email address").isEmail(),
    check("password", "password should be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  signup
);

router.get("/signout", signout);

module.exports = router;
