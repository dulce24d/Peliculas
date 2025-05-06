const express = require('express'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');  

// Ruta POST para registrar un usuario
router.post('/', async (req, res) => {
  const { user, contraseña, email, role } = req.body;

  try {
    // Validar existencia previa
    const existeUsuario = await Usuario.findOne({ $or: [{ user }, { email }] });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'Usuario o correo ya existe.' });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = new Usuario({
      user,
      contraseña: hash,
      email,
      role
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
});

module.exports = router;