const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Inizializza il database
const dbPath = path.resolve('./votes.db');
const db = new sqlite3.Database(dbPath);

// Crea la tabella al primo avvio
db.run(`
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL UNIQUE,
    vote TEXT NOT NULL
  )
`);

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, vote } = req.body;

    if (!userId || !vote) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }

    const query = 'INSERT INTO votes (userId, vote) VALUES (?, ?)';
    db.run(query, [userId, vote], (err) => {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'Codice già usato per votare.' });
        }
        return res.status(500).json({ error: 'Errore nel server.' });
      }
      res.status(200).json({ message: 'Voto registrato!' });
    });
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
