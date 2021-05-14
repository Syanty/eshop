const UserController = require("../controllers/user");
const router = require("express").Router();

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

router.get("/users", UserController.getAllUsers);

router.get("/users/:id", UserController.getUserInfo);

router.put("/users/:id", UserController.updateUser);

router.delete("/users/:id", UserController.deleteUser);

router.get("/users/get/count", UserController.getUsersCount);

module.exports = router;
