const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const fs = require('fs');
const https = require('https');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register
app.post('/api/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Name, Email und Passwort benötigt' });

    const users = loadUsers();
    if (users.find(u => u.email === email)) return res.status(409).json({ error: 'E-Mail bereits registriert' });

    const hashed = await bcrypt.hash(password, 10);
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const user = { id, name, email, password: hashed, joined: new Date().toLocaleDateString('de-DE'), watchlist: [] };
    users.push(user);
    saveUsers(users);

    const safeUser = Object.assign({}, user);
    delete safeUser.password;
    res.json({ user: safeUser });
  } catch (err) { next(err); }
});

// Login
app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email und Passwort benötigt' });

    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Ungültige Anmeldedaten' });

    const safeUser = Object.assign({}, user);
    delete safeUser.password;
    res.json({ user: safeUser });
  } catch (err) { next(err); }
});

// Fetch Vonovia price (VNA.DE) via Yahoo Finance public endpoint
app.get('/api/stock/vonovia', (req, res, next) => {
  const url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=VNA.DE';
  https.get(url, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const trimmed = data && data.toString().trim();
        if (!trimmed || !trimmed.startsWith('{')) {
          return res.status(502).json({ error: 'External API error', body: trimmed });
        }
        const json = JSON.parse(trimmed);
        const quote = json && json.quoteResponse && json.quoteResponse.result && json.quoteResponse.result[0];
        if (!quote) return res.status(502).json({ error: 'Kein Kurs gefunden' });
        const result = {
          symbol: quote.symbol,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          currency: quote.currency,
          timestamp: quote.regularMarketTime
        };
        res.json(result);
      } catch (e) {
        return res.status(502).json({ error: 'Parsing error' });
      }
    });
  }).on('error', (err) => next(err));
});

// Serve index.html für alle Routes (Single Page App)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
