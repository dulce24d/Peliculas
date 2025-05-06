const express = require('express');
const conectarDB = require('../db');
const loginRoute = require('../routes/login');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require('connect-flash');
const peliculasRoutes = require('../routes/Peliculas.js');
const app = express();
const passportConfig = require('../config/passport');
const registerRoute = require('../routes/register');


// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));


// Conectar a la base de datos
conectarDB();

// Ruta para API
app.use('/api/peliculas', peliculasRoutes);
app.use('/login', loginRoute);
app.use('/register', registerRoute);

// Configurar sesiones y Passport
app.use(cookieParser());
app.use(session({
  secret: 'secreto-romanceflix',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/agregar.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'agregar.html'));
});

app.listen(8080, () => {
  console.log('🚀 Servidor corriendo en http://localhost:8080');
});