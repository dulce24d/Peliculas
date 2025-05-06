const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SEED_AUTENTICACION);
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = verificarToken;
