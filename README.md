# 💹 WirtschaftsPortal

Ein modernes, interaktives Wirtschafts-Monitoring-Dashboard zum Überwachen von Aktien, Kryptowährungen und Forex-Märkten.

## 🎯 Features

- ✅ **Live-Dashboard** - Aktuelle Zeit und Datum
- 📈 **Aktien-Charts** - Überwache NVDA, MSFT, NFLX, TSLA, PLTR, AAPL, AMZN, NVO
- 🪙 **Krypto-Charts** - BTC, DOT, SOL, ETH, ADA, DOGE
- 💱 **Forex-Charts** - EUR/USD, GBP/USD, USD/JPY und mehr
- 🌘 **Dark/Light Mode** - Theme-Toggle
- ✨ **Partikel-Animation** - Dynamischer Hintergrund
- 🎨 **Modern Glass-Morphism Design** - Schöne UI mit Transparenzeffekten
- ⚡ **Live-Updates** - Auto-Update alle 5 Sekunden

## 🚀 Schnellstart

1. **Datei öffnen:**
   - Öffne `index.html` im Browser

2. **Mock-Daten nutzen (Standard):**
   - App funktioniert sofort mit realistischen Mock-Daten
   - `USE_MOCK_DATA = true` in `script.js`

3. **Echte API-Daten nutzen:**
   - Erhalte einen API-Key von [Alpha Vantage](https://www.alphavantage.co/)
   - Ersetze `HIER_DEIN_ALPHA_KEY` in `script.js`
   - Setze `USE_MOCK_DATA = false`

## 📁 Dateistruktur

- `index.html` - HTML-Struktur & Layout
- `style.css` - Styling (Glass-Morphism, Responsive)
- `script.js` - JavaScript-Logik (Charts, API-Calls)
- `README.md` - Dokumentation

## 🛠️ Technologie-Stack

- **HTML/CSS/JavaScript** - Vanilla Stack (keine Frameworks)
- **Chart.js** - Für Live-Charts (CDN)
- **Alpha Vantage API** - Optional für echte Marktdaten
- **Canvas API** - Partikel-Hintergrund-Animation

## 📊 API-Konfiguration

Öffne `script.js` und ersetze in Zeile 4-5:

```javascript
const ALPHA_KEY = "YOUR_API_KEY_HERE";
const USE_MOCK_DATA = false;
```

## 🎨 Anpassungen

**Update-Intervall ändern:** In `script.js` von 5000ms (5 Sekunden) zu deinem Wert ändern.

**Symbole hinzufügen:** In `script.js` die Arrays `stockSymbols`, `cryptoSymbols` oder `forexPairs` bearbeiten.

## 📱 Browser-Kompatibilität

- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile (responsive) ✅

## 📝 Lizenz

MIT License - Frei nutzbar! 