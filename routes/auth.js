const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

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

router.post(
  "/signin",
  //   this is validation for parameters from express validator
  [
    check("email", "Enter valid email").isEmail(),
    check("password", "password should be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  signin
);

router.get("/signout", signout);

// this is just for checking purpose
// router.get("/testRoute", isSignedIn, (req, res) => {
//   return res.send(req.auth);
// });

module.exports = router;
