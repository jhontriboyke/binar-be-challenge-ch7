const router = require("express").Router();
const userControllers = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate.middleware");

router.get(
  "/notifications",
  authenticate(""),
  userControllers.getNotifications
);

module.exports = router;
