const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const db = new sqlite3.Database('./users.db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Création de la table utilisateurs si elle n'existe pas
const initDb = () => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);
};

initDb();

// Middleware pour vérifier le rôle
function requireRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(403).send('Accès refusé');
    }
  };
}

// Middleware pour vérifier si un admin existe
function checkFirstAdmin(req, res, next) {
  db.get('SELECT * FROM users WHERE role = ?', ['admin'], (err, row) => {
    if (err) return res.status(500).send('Erreur serveur');
    if (!row && req.path !== '/register-admin') {
      return res.redirect('/register-admin');
    }
    next();
  });
}

app.use(checkFirstAdmin);

// Route pour créer le premier admin
app.get('/register-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register-admin.html'));
});

app.post('/register-admin', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Erreur serveur');
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, 'admin'], (err) => {
      if (err) return res.status(400).send('Utilisateur déjà existant');
      res.redirect('/login');
    });
  });
});

// Authentification
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (!user) return res.status(401).send('Identifiants invalides');
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { id: user.id, username: user.username, role: user.role };
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Identifiants invalides');
      }
    });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Interface de gestion (dashboard)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API REST utilisateurs (CRUD, réservé admin/gérant)
app.get('/api/users', requireRole('admin'), (req, res) => {
  db.all('SELECT id, username, role FROM users', (err, rows) => {
    if (err) return res.status(500).send('Erreur serveur');
    res.json(rows);
  });
});

app.post('/api/users', requireRole('admin'), (req, res) => {
  const { username, password, role } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Erreur serveur');
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role], (err) => {
      if (err) return res.status(400).send('Utilisateur déjà existant');
      res.status(201).send('Utilisateur créé');
    });
  });
});

app.delete('/api/users/:id', requireRole('admin'), (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send('Erreur serveur');
    res.send('Utilisateur supprimé');
  });
});

// Statique pour l'interface
app.use('/public', express.static(path.join(__dirname, 'public')));

// Page d'accueil
app.get('/', (req, res) => {
  res.redirect('/login');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Serveur démarré sur http://localhost:' + PORT);
});
