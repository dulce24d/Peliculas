const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//localStorage.setItem("token", data.token);
// Esquema y modelo del usuario
const usuarioSchema = new mongoose.Schema({
  user: String,
  contraseña: String,
  email: String,
  role: String
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema, 'Usuarios');

// Ruta POST para login
router.post('/', async (req, res) => {
  const { user, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ user });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no registrado' });  
    }

    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });  
    }

    // 🔐 Crear el token con datos seguros del usuario
    const token = jwt.sign(
      {
        _id: usuario._id,
        user: usuario.user,
        role: usuario.role
      },
      process.env.SEED_AUTENTICACION || 'mi_clave_secreta',
      { expiresIn: process.env.CADUCIDAD_TOKEN || '2h' }
    );

    // ✅ Enviar token al cliente
    res.status(200).json({
      mensaje: `Bienvenido, ${usuario.user}`,
      token,
      usuario: {
        _id: usuario._id,
        user: usuario.user,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });  
  }
});

module.exports = router;
