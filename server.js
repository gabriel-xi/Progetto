const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const dotenv = require('dotenv');
const express = require('express');

// Configurazione dotenv nel file .env per accedere alle variabili d'ambiente
dotenv.config();

// Crea una connessione al database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Verifica la connessione al database
db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
    return;
  }
  console.log('Connessione al database riuscita!');
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Usa i file html e css nella cartella public
app.use(express.static(path.join(__dirname, 'public')));

// Rotta per la pagina di login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rotta per la pagina di registrazione
app.get('/registrazione', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registrazione.html'));
});

// Gestione del form di registrazione
app.post('/registrati', (req, res) => {
  const { username, nome, cognome, email, password, confirm_password } = req.body;

  // Controlla campi obbligatori
  if ([username, nome, cognome, email, password, confirm_password].some(field => !field || !field.trim())) {
    return res.json({ error: 'Tutti i campi sono obbligatori!' });
  }

  // Verifica se la password e la conferma della password sono uguali
  if (password !== confirm_password) {
    return res.json({ error: 'Le password non coincidono!' });
  }

  // Verifica se l'email è già presente nel database
  db.query('SELECT * FROM Users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ error: 'Errore del server!' });
    }

    if (result.length > 0) {
      return res.json({ error: 'Email già registrata!' });
    }

    // Verifica se l'username è già presente nel database
    db.query('SELECT * FROM Username WHERE username = ?', [username], (err, result) => {
      if (err) {
        console.error(err);
        return res.json({ error: 'Errore del server!' });
      }

      if (result.length > 0) {
        return res.json({ error: 'Username già esistente!' });
      }

      // Crittografa la password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.json({ error: 'Errore nella crittografia della password!' });
        }

        // Inserisce il nuovo utente nella tabella Users
        db.query(
          'INSERT INTO Users (nome, cognome, email, passw, user_type) VALUES (?, ?, ?, ?, ?)',
          [nome.trim(), cognome.trim(), email.trim(), hashedPassword, 1],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.json({ error: 'Errore nel salvataggio dell\'utente!' });
            }

            // Ottiene l'id dell'utente appena inserito
            const userId = result.insertId;

            // Inserisce l'username nella tabella Username
            db.query(
              'INSERT INTO Username (id, username) VALUES (?, ?)',
              [userId, username.trim()],
              (err) => {
                if (err) {
                  console.error(err);
                  return res.json({ error: 'Errore nel salvataggio dello username!' });
                }

                return res.json({ success: 'Registrazione avvenuta con successo!' });
              }
            );
          }
        );
      });
    });
  });
});
// Rotta login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Controlla campi obbligatori
  if (!email || !password || !email.trim() || !password.trim()) {
    return res.json({ error: 'Tutti i campi sono obbligatori!' });
  }

  // Controlla se l'utente esiste nel database tramite email
  db.query('SELECT * FROM Users WHERE email = ?', [email.trim()], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ error: 'Errore del server!' });
    }

    if (result.length === 0) {
      return res.json({ error: 'email_errata' });
    }

    // Confronta la password fornita con quella memorizzata nel database
    bcrypt.compare(password, result[0].passw, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.json({ error: 'Errore nella verifica della password!' });
      }

      if (!isMatch) {
        return res.json({ error: 'password_errata' });
      }

      // Se la password è corretta, salva l'utente nella sessione
      req.session.user = result[0];

      // Risposta positiva, l'utente è loggato
      return res.json({ success: true });
    });
  });
});

// Rotta per la pagina di login
app.get('/', (req, res) => {
  // Passa l'errore se presente nella query string
  const error = req.query.error;
  res.sendFile(path.join(__dirname, 'public', 'index.html'), { error });
});

// Rotta per la home page (accessibile solo se autenticato)
app.get('/home', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }

  res.send(`<h1>Benvenuto, ${req.session.user.nome}!</h1>`);
});

// Esegui il server sulla porta 3000
app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});