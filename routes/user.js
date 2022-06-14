const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  login,
  createPokemon
} = require("../controllers/user");
const router = express.Router();
const { verifyToken } = require("../middlewares/verify");

router.post("/login", login);

router.get("/", getUsers);

router.post("/", createUser);

router.post("/pokemon", verifyToken, createPokemon)

router.put("/:id", updateUser);

module.exports = router;
