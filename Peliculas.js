const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const esAdmin = require('../middlewares/esAdmin');

// Esquema y modelo
const pelischema = new mongoose.Schema({
  Titulo: String,
  Actores: String,
  Año: Number,
  Categoria: String,
  Sipnosis: String,
  Imagen: String,
  Director: String,
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  autorizacionEliminar: { type: Boolean, default: false }
});

const Pelicula = mongoose.models.Pelicula || mongoose.model('Pelicula', pelischema, 'Peliculas');

// 🔍 Buscar o listar películas
router.get('/', async (req, res) => {
  const q = req.query.search;

  if (!q) {
    try {
      const peliculas = await Pelicula.find();
      return res.json(peliculas);
    } catch (error) {
      return res.status(500).json({ mensaje: 'Error al obtener las películas' });
    }
  }

  const regex = new RegExp(q, 'i');

  try {
    const resultados = await Pelicula.find({
      $or: [
        { Titulo: regex },
        { Actores: regex },
        { Categoria: regex },
        { Sipnosis: regex },
        { Director: regex }
      ]
    });

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar películas' });
  }
});

// ➕ Crear película (usuario logueado)
router.post('/', verificarToken, async (req, res) => {
  try {
    const nueva = new Pelicula({
      ...req.body,
      usuario_id: req.usuario._id
    });

    await nueva.save();
    res.status(201).json({ mensaje: 'Película agregada', pelicula: nueva });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al guardar película', error });
  }
});

// ✏️ Modificar película (solo si es dueño)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);

    if (!pelicula) return res.status(404).json({ mensaje: 'Película no encontrada' });

    if (String(pelicula.usuario_id) !== req.usuario._id) {
      return res.status(403).json({ mensaje: 'No puedes modificar esta película' });
    }

    Object.assign(pelicula, req.body);
    await pelicula.save();

    res.json({ mensaje: 'Película actualizada', pelicula });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar película', error });
  }
});

// ❌ Eliminar película (solo admin o con autorización)
router.delete('/:id', verificarToken, esAdmin, async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    if (!pelicula) return res.status(404).json({ mensaje: 'Película no encontrada' });

    await Pelicula.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Película eliminada' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
});

module.exports = router;
