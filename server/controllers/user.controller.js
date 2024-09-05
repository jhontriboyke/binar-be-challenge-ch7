const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  getNotifications: async (req, res) => {
    const { id } = req.user;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "Notifications retrieved",
        notifications: user.notifications,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  register: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email and password",
      });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(409).json({
        message: "Email already used",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await User.create({
        email: email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "User created",
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email and password",
      });
    }

    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(409).json({
          message: "Email or password incorrect",
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(409).json({
          message: "Email or password incorrect",
        });
      }

      if (userAgent !== user.userAgents) {
        const generateOtp = Math.floor(1000 + Math.random() * 9000);

        user.otp = generateOtp;
        await user.save();

        const mailOptions = {
          from: "your-email@gmail.com",
          to: user.email,
          subject: "Your OTP Code",
          html: `<p>Your OTP code is <strong>${generateOtp}</strong>.</p>`,
        };

        try {
          await transporter.sendMail(mailOptions);
          return res.status(200).json({
            message: "OTP email sent successfully",
            need_otp: true,
          });
        } catch (error) {
          throw error;
        }
      }

      const token = await jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        message: "Login success",
        data: token,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  verifyOtp: async (req, res) => {
    const { otp, email } = req.body;
    const userAgent = req.headers["user-agent"];

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide email and otp",
      });
    }

    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: "Email or password incorrect",
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          message: "OTP not valid",
        });
      }

      user.otp = null;
      user.userAgents = userAgent;
      await user.save();

      const token = await jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "OTP verified",
        data: token,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  sendChangePasswordLink: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Provide valid email",
      });
    }

    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({
          message: "Email or password incorrect",
        });
      }

      const resetPasswordToken = await jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY_RESETPASSWORD,
        {
          expiresIn: "10m",
        }
      );

      user.resetPasswordToken = resetPasswordToken;
      await user.save();

      const mailOptions = {
        from: "your-email@gmail.com",
        to: user.email,
        subject: "Your Reset Password Link",
        html: `<p>Your reset password link 
        <strong>
          <a href="http://localhost:5173/change-forgot-password?token=${resetPasswordToken}">Click here</a>
        </strong></p>`,
      };

      try {
        // Send email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
          message: "Password reset link sent successfully",
          need_otp: true,
        });
      } catch (error) {
        throw error;
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  checkResetPasswordToken: async (req, res) => {
    const { token } = req.query;

    try {
      const user = await User.findOne({ resetPasswordToken: token });
      if (!user) {
        throw new Error("You cannot access this resource");
      }

      if (user.resetPasswordToken !== token) {
        throw new Error("You cannot acces this resource");
      }

      const decoded = await jwt.verify(
        token,
        process.env.JWT_SECRET_KEY_RESETPASSWORD
      );

      res.status(200).json({ message: "Reset Password Token valid" });
    } catch (error) {
      return res.status(403).json({
        message: error.message,
      });
    }
  },
  changePassword: async (req, res) => {
    const { id } = req.user;
    const { newPassword } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedNewPassword;
      await user.save();

      res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Error in changePassword:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  },
  changeForgotPassword: async (req, res) => {
    const { id, email } = req.user;
    const { newPassword } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(403).json({
          message: "You cannot access this resource",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      user.resetPasswordToken = null;
      user.password = hashedNewPassword;

      await user.save();

      return res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
