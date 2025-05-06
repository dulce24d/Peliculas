const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'contraseña'
  }, async (user, contraseña, done) => {
    try {
      const usuario = await Usuario.findOne({ user });
      if (!usuario) return done(null, false, { message: 'Usuario no encontrado' });

      const match = await usuario.validarPassword(contraseña);
      if (!match) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, usuario);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((usuario, done) => done(null, usuario.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await Usuario.findById(id);
      done(null, usuario);
    } catch (err) {
      done(err);
    }
  });
};