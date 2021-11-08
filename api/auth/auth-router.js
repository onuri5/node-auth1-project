const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const router = express.Router();

const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require("./auth-middleware");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 6);
      const newUser = { username, password: hash };
      const user = await Users.add(newUser);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", checkUsernameExists, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });

    if (!bcrypt.compareSync(password, user.password)) {
      return next({ status: 401, message: "Invalid credentials" });
    }

    req.session.user = user;
    res.json({ message: `Welcome ${user.username}!` });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  if (!req.session.user) {
    next({ message: "no session" });
  }
  req.session.destroy((err) => {
    if (err) {
      return next({ message: "something went wrong" });
    }
    next({ status: 200, message: "logged out" });
  });
});

module.exports = router;
