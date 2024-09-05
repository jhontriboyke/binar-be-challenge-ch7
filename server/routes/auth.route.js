const router = require("express").Router();
const userControllers = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate.middleware");

router.post("/register", userControllers.register);

router.post("/login", userControllers.login);

router.post("/verify-otp", userControllers.verifyOtp);

router.get(
  "/check-reset-password-token",
  userControllers.checkResetPasswordToken
);

// Send change password link
router.post("/forgot-password", userControllers.sendChangePasswordLink);

router.post(
  "/change-password",
  authenticate(""),
  userControllers.changePassword
);

router.post(
  "/change-forgot-password",
  authenticate("reset"),
  userControllers.changeForgotPassword
);

module.exports = router;
