// middlewares/authenticate.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "seu_segredo_aqui";

function authenticate(req, res, next) {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({ error: "Não autenticado. Token ausente." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // salva os dados do usuário no request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = authenticate;
