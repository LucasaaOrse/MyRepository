// adminAuth.js
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

module.exports = function(req, res, next) {
  let token

  // 1) tenta ler do header Authorization
  const authHeader = req.headers['authorization']
  if (authHeader) {
    const parts = authHeader.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1]
    }
  }

  // 2) se não veio no header, tenta ler do cookie chamado "session"
  if (!token && req.cookies && req.cookies.session) {
    token = req.cookies.session
  }

  if (!token) {
    return res.status(403).json({ error: 'Acesso não autorizado' })
  }

  // 3) valida o JWT
  try {
    const decoded = jwt.verify(token, secret)
    if (decoded.role === 1) {
      // tudo OK, é admin
      next()
    } else {
      return res.status(403).json({ error: 'Sem acesso administrador' })
    }
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' })
  }
}
