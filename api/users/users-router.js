const express = require("express");
const router = express.Router();
const Users = require("./users-model");
const { restricted } = require("../auth/auth-middleware");

  router.get("/", restricted, (req, res, next) => {
    Users.find()
      .then(userArr => {
        res.status(200).json(userArr);
      })
      .catch(err => {
        next({ status: 500, message: err});
      });
  });


module.exports = router;
