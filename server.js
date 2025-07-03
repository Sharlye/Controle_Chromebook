const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database/db.sqlite', (err) => {
  if (err) console.error(err);
  else console.log('Banco conectado.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS registros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    escola TEXT,
    inep TEXT,
    modelo TEXT,
    quantidade INTEGER,
    data TEXT
  )
`);

app.post('/api/registrar', (req, res) => {
  const { escola, inep, modelo, quantidade, data } = req.body;
  db.run(
    `INSERT INTO registros (escola, inep, modelo, quantidade, data) VALUES (?, ?, ?, ?, ?)`,
    [escola, inep, modelo, quantidade, data],
    function (err) {
      if (err) {
        res.status(500).json({ erro: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

app.get('/api/registros', (req, res) => {
  db.all(`SELECT * FROM registros`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
