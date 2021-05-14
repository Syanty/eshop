const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const responseHandler = require("../helpers/response-handler");
const validateObjectId = require("../helpers/object-id-validator");

const UserController = {
  async signup(req, res) {
    req.body.passwordHash = bcrypt.hashSync(req.body.passwordHash, 10);
    const user = new User(req.body);

    await user
      .save()
      .then(() => {
        responseHandler.added(res, "User registered successfully");
      })
      .catch((err) => {
        if (err.code === 11000 && err.name === "MongoError") {
          responseHandler.badrequest(res, "Email already exists");
        } else {
          responseHandler.error(res, err);
        }
      });
  },

  async login(req, res) {
    const secret = process.env.TOKEN_SECRET;
    await User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
            const token = jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
              },
              secret,
              {
                expiresIn: "1d",
              }
            );
            responseHandler.found(res, {
              user: user,
              token: token,
            });
          } else {
            responseHandler.badrequest(res, "Incorrect Password");
          }
        } else {
          responseHandler.notfound(res, "User not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },

  async getAllUsers(req, res) {
    await User.find()
      .select("-passwordHash")
      .then((users) => {
        if (users) {
          responseHandler.found(res, users);
        } else {
          responseHandler.notfound(res, "No users found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getUserInfo(req, res) {
    validateObjectId(res, req.params.id);
    User.findById(req.params.id)
      .select("-passwordHash -_id")
      .then((user) => {
        if (user) {
          responseHandler.found(res, user);
        } else {
          responseHandler.notfound(res, "User not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async getUsersCount(req, res) {
    const userCount = await User.countDocuments();
    await User.find({ isAdmin: true })
      .count()
      .then((adminCount) => {
        if (userCount) {
          responseHandler.found(res, {
            TotalUsers: userCount,
            TotalAdmin: adminCount,
          });
        } else {
          responseHandler.notfound(res, "Users not found");
        }
      });
  },
  async updateUser(req, res) {
    validateObjectId(res, req.params.id);

    await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((updatedUser) => {
        if (updatedUser) {
          responseHandler.updated(res, "User successfully updated.");
        }else{
          responseHandler.notfound(res, "User not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
  async deleteUser(req, res) {
    validateObjectId(res, req.params.id);
    await User.findByIdAndRemove(req.params.id)
      .then((deletedUser) => {
        if (deletedUser) {
          responseHandler.deleted(res, "User successfully deleted.");
        }else{
          responseHandler.notfound(res, "User not found");
        }
      })
      .catch((err) => {
        responseHandler.error(res, err);
      });
  },
};

module.exports = UserController;
