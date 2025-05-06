const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' }
});

// Hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.validarPassword = function (contraseña) {
  return bcrypt.compare(contraseña, this.contraseña);
};

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema, 'Usuarios');
