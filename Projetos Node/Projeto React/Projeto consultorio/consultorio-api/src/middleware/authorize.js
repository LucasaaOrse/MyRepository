// middlewares/authorize.js

function authorize(...allowedTypes) {
    return (req, res, next) => {
      const userType = req.user?.type;
  
      if (!allowedTypes.includes(userType)) {
        return res.status(403).json({ error: "Acesso negado: permissão insuficiente." });
      }
  
      next();
    };
  }
  
  module.exports = authorize;
  