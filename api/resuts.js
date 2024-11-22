const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inizializza il database
const dbPath = path.resolve('./votes.db');
const db = new sqlite3.Database(dbPath);

export default function handler(req, res) {
  db.all('SELECT userId, vote FROM votes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nel server.' });
    }
    res.status(200).json(rows);
  });
}
