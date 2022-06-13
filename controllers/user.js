const db = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { TOKEN_SECRET } = require("../middlewares/verify");


const getUsers = async (req, res, next) => {
    try {
      const users = await db.query(`Select * from users`);
     
  
      return res
        .status(200)
        .json({ success: true, data: users.rows, message: ":D" });
    } catch (error) {
      return next(error);
    }
  };
  
  const createUser = async (req, res, next) => {
    try {
      const newUser = req.body;
      if (!newUser.name || !newUser.mail || !newUser.password) {
        return res.send({
          success: false,
          data: [],
          message: "No se puede dejar vacío el campo nombre ni el campo email",
        });
      }
  
      if (!/^\S+@\S+\.\S+$/.test(newUser.mail)) {
        return res.send({
          success: false,
          message: "Email inválido",
        });
      }
      const users = await db.query("select * from users where mail = $1 ", [
        newUser.mail,
      ]);
  
      const existeUsuario = users.rowCount > 0;
      if (existeUsuario) {
        return res.send({
          success: false,
          data: [],
          message: "Ya existe un usuario con ese correo",
        });
      }
  
      const ROUNDS = 10;
  
      const passwordHashed = await bcrypt.hash(newUser.password, ROUNDS);
  
      const createdUser = await db.query(
        "insert into users(name, mail, password) values($1, $2, $3)",
        [newUser.name, newUser.mail, passwordHashed]
      );
  
      return res
        .status(201)
        .json({ success: true, data: createdUser.rows, message: "Usuario creado!" });
    } catch (error) {
      return next(error);
    }
  };
  
  const login = async (req, res, next) => {
    try {
      const { mail, password } = req.body;
      if (!mail || !password) {
        return res.send({
          success: false,
          data: [],
          message: "Ingrese su correo y su contraseña",
        });
      }
  
      const user = await db.query("select * from users where mail = $1 ", [mail]);
  
      if (user.rowCount === 0) {
        return res.send({
          success: false,
          data: [],
          message: "No se encontró el usuario",
        });
      }
  
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
  
      if (!validPassword) {
        return res
          .status(401)
          .json({ success: false, data: [], message: "¿Quién sos y por qué?" });
      }
  
      const token = jwt.sign(
        {
          name: user.rows[0].name,
          mail: user.rows[0].mail,
        },
        TOKEN_SECRET
      );
  
      return res
        .status(200)
        .json({ success: true, data: user.rows[0], message: "Éxito", token });
    } catch (error) {
      return next(error);
    }
  };
  
  const updateUser = (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const { nombre, edad } = req.body;
  
      const index = usuarios.findIndex((u) => u.id === id);
  
      if (index >= 0) {
        usuarios[index].nombre = nombre;
        usuarios[index].edad = edad;
        return res.send({ data: usuarios, message: "Actualizado" });
      }
  
      return res.send({ message: "No se encontró el id" });
    } catch (error) {
      return next(error);
    }
  };


  module.exports = { getUsers, createUser, updateUser, login };