const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = {
      colaboradorId: decoded.colaboradorId,
      nome: decoded.nome
    };

    next();
  });
};

module.exports = authenticateToken;
