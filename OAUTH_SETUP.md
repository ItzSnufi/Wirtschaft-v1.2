# WirtschaftsPortal - OAuth Setup Guide

## 🚀 Schnellstart mit OAuth

Dieses Dashboard unterstützt jetzt Social Login mit **Google** und **Discord**!

### ⚡ 5-Minuten Schnellstart (Anfänger)

1. **Google-Credentials holen (2 Min)**
   - https://console.cloud.google.com öffnen
   - **Neues Projekt** erstellen (oben links)
   - Linkes Menü: **APIs und Services** → **Anmeldedaten** klicken
   - **WICHTIG:** Reiter **OAuth-Zustimmungsbildschirm** (nicht Anmeldedaten erstellen!)
   - **Extern** → **Erstellen**
   - App-Name: "WirtschaftsPortal"
   - Support-E-Mail: deine@email.com
   - **Speichern und weiter** (alle Seiten durchgehen)
   - Zurück zu **Anmeldedaten**
   - **+ Anmeldedaten erstellen** → **OAuth 2.0-Client-ID**
   - Typ: **Webanwendung**
   - URI: `http://localhost:5000/auth/google/callback`
   - **Erstellen** → **Client-ID** + **Geheimer Schlüssel kopieren!**

2. **Discord-Credentials holen (2 Min)**
   - https://discord.com/developers/applications öffnen
   - **New Application** klicken (englisch, gibt es kein Deutsch)
   - Reiter **OAuth2** (linke Sidebar)
   - **CLIENT ID** kopieren
   - **Reset Secret** klicken → **CLIENT SECRET** kopieren
   - **ADD REDIRECT** klicken:
     - `http://localhost:5000/auth/discord/callback`
   - **Save Changes** klicken

3. **.env Datei ausfüllen (1 Min)**
   ```bash
   cp .env.example .env
   ```
   - `.env` im Editor öffnen
   - Google Client ID + Secret eintragen
   - Discord Client ID + Secret eintragen
   - Speichern!

4. **Starten:**
   ```bash
   npm install
   npm start
   ```

Done! ✅ http://localhost:5000

### 📋 Voraussetzungen

- Node.js 14+ installiert
- npm oder yarn
- Google Account (für Google OAuth)
- Discord Account (für Discord OAuth)

### 🔧 Installation

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **OAuth-Credentials beschaffen:**

   #### Google OAuth (Deutsch) - Schritt-für-Schritt

   ⚠️ **WICHTIG:** Der **OAuth-Zustimmungsbildschirm** MUSS ZUERST erstellt werden, sonst sehen Sie nur "API-Schlüssel", "Dienstkonto" aber nicht "OAuth 2.0-Client-ID"!

   **Schritt 1: OAuth-Zustimmungsbildschirm einrichten (ZUERST!)**
   - https://console.cloud.google.com öffnen
   - Oben links: **Neues Projekt** erstellen
   - Warte bis Projekt fertig ist
   - Linkes Menü: **APIs und Services** → **Anmeldedaten** klicken
   - Oben: **OAuth-Zustimmungsbildschirm** Reiter klicken (NICHT "Anmeldedaten erstellen"!)
   - **Extern** wählen → **Erstellen**
   - Formular ausfüllen:
     - App-Name: WirtschaftsPortal
     - Support-E-Mail: deine@email.com
     - Developer E-Mail: deine@email.com
   - **Speichern und weiter** durchklicken (alle Seiten)

   **Schritt 2: OAuth 2.0-Client-ID erstellen**
   - Nach dem Zustimmungsbildschirm → **Anmeldedaten** Menü (linke Sidebar)
   - Blauer Button: **+ Anmeldedaten erstellen**
   - Dropdown wähle: **OAuth 2.0-Client-ID** (jetzt sollte es hier sein!)
   - Anwendungstyp: **Webanwendung**
   - Name: WirtschaftsPortal
   - **Autorisierte Weiterleitungs-URIs** → **URI hinzufügen**:
     - `http://localhost:5000/auth/google/callback`
   - **Erstellen**
   - ✅ Popup mit **Client-ID** + **Geheimer Schlüssel** → Kopieren!

   #### Discord OAuth
   - Gehe zu: https://discord.com/developers/applications
   - Klick auf **New Application** (oben rechts)
   - Gib einen Namen ein: "WirtschaftsPortal"
   - Akzeptiere die ToS und klick **Create**
   - Gehe zum Tab **OAuth2** (linke Sidebar)
   - Unter **CLIENT INFORMATION**:
     - Kopiere die **CLIENT ID**
     - Klick auf **Reset Secret** → kopiere das **CLIENT SECRET**
   - Scrolle runter zu **Redirects**
   - Klick **Add Redirect** und füge hinzu: `http://localhost:5000/auth/discord/callback`
   - Klick **Save Changes**
   - Trage die Werte in deine `.env` ein

3. **.env Datei erstellen:**
   ```bash
   cp .env.example .env
   ```

   Öffne `.env` und füge deine Credentials ein:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   
   DISCORD_CLIENT_ID=your_discord_client_id_here
   DISCORD_CLIENT_SECRET=your_discord_client_secret_here
   
   SESSION_SECRET=dein_geheimer_session_key_hier
   PORT=5000
   ```

4. **Server starten:**
   ```bash
   npm start
   ```

   Oder im Entwicklungsmodus mit Auto-Reload:
   ```bash
   npm run dev
   ```

5. **Im Browser öffnen:**
   ```
   http://localhost:5000
   ```

---

## 🎯 Quick Reference - Wo finde ich meine Credentials?

### Google Cloud Console:
```
console.cloud.google.com
  → Neues Projekt
  → APIs und Services (linkes Menü)
    → Anmeldedaten
      → OAuth-Zustimmungsbildschirm Reiter (WICHTIG!)
        → Extern → Erstellen
        → App-Name + E-Mail
        → Speichern und weiter
      → + Anmeldedaten erstellen
        → OAuth 2.0-Client-ID (nur wenn Zustimmungsbildschirm vorher erstellt!)
          → Webanwendung
          → http://localhost:5000/auth/google/callback
          → Client-ID + Geheimer Schlüssel kopieren!
```

⚠️ **Häufiger Fehler:** Zustimmungsbildschirm vergessen = OAuth 2.0-Client-ID nicht sichtbar!

### Discord Developer Portal (Englisch)
```
https://discord.com/developers/applications
  ↓
+ New Application
  ↓
OAuth2 Tab (linke Sidebar)
  ↓
CLIENT ID + CLIENT SECRET 📋
  ↓
ADD REDIRECT: http://localhost:5000/auth/discord/callback
  ↓
Save Changes ✅
```

---

## � Wichtig zu wissen

⚠️ **Der Server MUSS laufen für Social Login!**
- Ohne Server: OAuth-Buttons sind inaktiv
- Mit lokalem `.env.example`: Demo-Account funktioniert (kein OAuth nötig)

✅ **Daten speichern:**
- Benutzer-Daten: localStorage (Browser)
- OAuth-Verknüpfungen: localStorage
- Bei Neustart: Daten bleiben erhalten (in `.env` keine Datenbank nötig!)

---

## �🔐 Features

✅ Google Sign-In
✅ Discord Sign-In
✅ Account Linking (mehrere Social-Accounts mit einem Profil verknüpfen)
✅ Sichere Sessions
✅ LocalStorage für Offline-Daten

---

## 📱 Mobile Nutzung

Für Mobile-Apps müssen die Redirect-URIs angepasst werden:
- iOS: `wirtschaftsportal://callback`
- Android: `com.wirtschaftsportal://callback`

---

## 🐛 Troubleshooting

**„OAuth credentials not configured"**
→ Überprüfe, dass `.env` die korrekten Credentials enthält

**„Redirect URI mismatch" oder „Invalid redirect_uri"**
→ Stelle sicher, dass die Redirect-URL in Google Console / Discord genau mit der in `.env` übereinstimmt:
   - Google: **Autorisierte Weiterleitungs-URIs** müssen genau `http://localhost:5000/auth/google/callback` sein
   - Discord: **Redirects** müssen genau `http://localhost:5000/auth/discord/callback` sein

**„Cannot find module 'passport'"**
→ Dependencies nicht installiert:
   ```bash
   npm install
   ```

**OAuth-Buttons funktionieren nicht**
→ Server läuft nicht! Terminal:
   ```bash
   npm start
   ```
   → http://localhost:5000 öffnen (nicht file://)

**„Wenn ich + Anmeldedaten erstellen klicke, sehe ich nur API-Schlüssel, Dienstkonto, Auswahlhilfe"**
→ Der **OAuth-Zustimmungsbildschirm** wurde nicht erstellt! Das ist ein MUSS-Schritt!
   - Gehe zu **Anmeldedaten** → Reiter **OAuth-Zustimmungsbildschirm** (oben in der Tabelle!)
   - **Extern** wählen → **Erstellen**
   - App-Name + E-Mail eintragen → **Speichern und weiter**
   - Alle Seiten durchgehen und speichern
   - Zurück zu **Anmeldedaten** → Jetzt sollte **OAuth 2.0-Client-ID** im Dropdown sein! ✅

---

## 📚 Weitere Ressourcen

- [Passport.js Dokumentation](http://www.passportjs.org)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Discord OAuth 2.0](https://discord.com/developers/docs/topics/oauth2)

---

## 📍 TL;DR - Client-IDs finden (auf Deutsch):

### Google Cloud Console:
```
console.cloud.google.com
  → Projekt erstellen
  → APIs und Services (linkes Menü!)
    → Bibliothek
      → Google+ API aktivieren
    → Anmeldedaten
      → + Anmeldedaten erstellen
        → OAuth 2.0-Client-ID
          → Client-ID + Geheimer Schlüssel kopieren!
```

⚠️ **Wichtig:** **APIs und Services** ist im **linken Menü**!

### Discord Developer Portal:
```
discord.com/developers/applications
  → New Application
    → OAuth2 (linke Sidebar)
      → CLIENT ID kopieren
      → Reset Secret (CLIENT SECRET kopieren)
```

✅ Dann in `.env` eintragen und `npm install && npm start`!

