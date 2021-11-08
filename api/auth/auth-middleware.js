const Users = require("../users/users-model");

module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
};

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

function checkUsernameFree(req, res, next) {
  Users.find()
    .then((usersArr) => {
      usersArr.map((user) => {
        if (user.username === req.body.username) {
          next({ status: 422, message: "username taken" });
        }
      });
      next();
    })
    .catch(next);
}

async function checkUsernameExists(req, res, next) {
  const { username } = req.body;
  const [user] = await Users.findBy({ username });
  if (!user) {
    next({ status: 401, message: "Invalid credentials" });
  } else {
    next();
  }
}

function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (password === undefined || password.length <= 3) {
    next({ status: 422, message: "Password must be longer than 3 chars" });
  } else {
    next();
  }
}
