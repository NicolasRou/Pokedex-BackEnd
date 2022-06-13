const db = require("../db/index");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../middlewares/verify");

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

module.exports = { login };
