const esAdmin = (req, res, next) => {
    if (req.usuario.role === 'admin') {
      return next();
    }
    return res.status(403).json({ mensaje: 'Solo el administrador puede realizar esta acción.' });
  };
  
  module.exports = esAdmin;