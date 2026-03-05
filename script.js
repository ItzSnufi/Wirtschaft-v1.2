// ========================
// GLOBAL VARIABLES
// ========================

let stockChartCtx, cryptoChartCtx, forexChartCtx;
let stockChart, cryptoChart, forexChart;
let ctx, canvas, particlesArray = [];

const stockSymbols = [
  'NVDA','MSFT','NFLX','TSLA','PLTR','AAPL','AMZN','NVO','VOW','VNA.DE',
  'GOOG','META','BABA','SAP','SIE.DE','BMW.DE'
];
const cryptoSymbols = ['BTC','DOT','SOL','ETH','ADA','DOGE','BNB','XRP','LTC'];
const forexPairs = [
  ['EUR','USD'], ['USD','EUR'], ['GBP','USD'], ['USD','GBP'],
  ['USD','JPY'], ['USD','CHF'], ['EUR','GBP'], ['EUR','JPY'],
  ['AUD','USD'], ['CAD','USD'], ['EUR','CAD'], ['NZD','USD'], ['USD','SGD']
];

const stockPrices = {
  NVDA:140, MSFT:430, NFLX:280, TSLA:240, PLTR:35, AAPL:195, AMZN:185, NVO:95, VOW:25, 'VNA.DE':30,
  GOOG:2700, META:320, BABA:90, SAP:115, 'SIE.DE':120, 'BMW.DE':70
};
let currentStockTimeframe = '1d';
let currentStockFilter = 'all';

const cryptoPrices = { BTC:95000, DOT:35, SOL:210, ETH:5500, ADA:1.05, DOGE:0.42, BNB:600, XRP:0.75, LTC:120 };
let currentCryptoTimeframe = '1d';
let currentCryptoFilter = 'all';

const forexRates = {
  'EUR/USD':1.08, 'USD/EUR':0.93, 'GBP/USD':1.27, 'USD/GBP':0.79,
  'USD/JPY':150, 'USD/CHF':0.88, 'EUR/GBP':0.86, 'EUR/JPY':162,
  'AUD/USD':0.67, 'CAD/USD':0.74, 'EUR/CAD':1.45, 'NZD/USD':0.62, 'USD/SGD':1.36
};
// Human-readable infos for symbols
const stockInfos = {
  NVDA: 'NVIDIA Corporation – Grafikprozessoren und KI‑Chips.',
  MSFT: 'Microsoft – Software, Cloud (Azure) und Office‑Suite.',
  NFLX: 'Netflix – Streamingdienst und Medienproduktion.',
  TSLA: 'Tesla – Elektrofahrzeuge und Energiespeicher.',
  PLTR: 'Palantir – Datenanalyse‑ und Softwarelösungen für Unternehmen.',
  AAPL: 'Apple – Consumer‑Elektronik, iPhone, Services.',
  AMZN: 'Amazon – E‑Commerce, AWS Cloud und Logistik.',
  NVO: 'Novo Nordisk – Pharmazeutika, vor allem Diabetes‑Medikamente.',
  VOW: 'Volkswagen (VOW) – Automobilhersteller (Ticker variiert).',
  'VNA.DE': 'Vonovia SE – größter Wohnungs‑ und Immobilienkonzern in Deutschland.',
  GOOG: 'Alphabet (Google) – Suchmaschine, Werbung, Cloud und YouTube.',
  META: 'Meta Platforms – Betreiber von Facebook, Instagram und VR‑Produkten.',
  BABA: 'Alibaba – chinesischer E‑Commerce und Cloud‑Anbieter.',
  SAP: 'SAP – Unternehmenssoftware und ERP‑Lösungen.',
  'SIE.DE': 'Siemens – Industrie, Automation und Energie.',
  'BMW.DE': 'BMW – Premium‑Automobilhersteller.'
};

const cryptoInfos = {
  BTC: 'Bitcoin – dezentrale digitale Währung und Wertaufbewahrung.',
  ETH: 'Ethereum – Smart‑Contract Plattform und umfangreiche Ökonomie.',
  SOL: 'Solana – schnelle Smart‑Contract Plattform mit niedrigen Gebühren.',
  DOT: 'Polkadot – Interoperabilität zwischen Blockchains.',
  ADA: 'Cardano – forschungsbasierte Smart‑Contract Plattform.',
  DOGE: 'Dogecoin – meme‑orientierte Kryptowährung.',
  BNB: 'Binance Coin – native Token der Binance‑Plattform.',
  XRP: 'XRP – Zahlungs‑ und Überweisungsprotokoll (Ripple).',
  LTC: 'Litecoin – schnelle, lite Version von Bitcoin.'
};

const forexInfos = {
  'EUR/USD': 'Euro / US‑Dollar – das meistgehandelte Währungspaar.',
  'USD/EUR': 'US‑Dollar / Euro – Kehrwert von EUR/USD.',
  'GBP/USD': 'Britisches Pfund / US‑Dollar – wichtiger Forex‑Paar.',
  'USD/GBP': 'US‑Dollar / Britisches Pfund.',
  'USD/JPY': 'US‑Dollar / Japanischer Yen – oft hohe Volatilität.',
  'USD/CHF': 'US‑Dollar / Schweizer Franken – Safe‑haven Währung.',
  'EUR/GBP': 'Euro / Britisches Pfund – wichtiger europäischer Cross.',
  'EUR/JPY': 'Euro / Japanischer Yen.',
  'AUD/USD': 'Australischer Dollar / US‑Dollar – Rohstoff‑empfindlich.',
  'CAD/USD': 'Kanadischer Dollar / US‑Dollar – Ölpreisabhängig.',
  'EUR/CAD': 'Euro / Kanadischer Dollar.',
  'NZD/USD': 'Neuseeländischer Dollar / US‑Dollar.',
  'USD/SGD': 'US‑Dollar / Singapur-Dollar.'
};

function showSymbolInfo(type, symbol) {
  try {
    const langDict = translations[currentLang] || translations.de;
    const key = `${type}-info-${symbol}`;
    const defaultText = (type === 'stock' ? stockInfos[symbol]
                     : type === 'crypto' ? cryptoInfos[symbol]
                     : forexInfos[symbol]) || 'Keine zusätzliche Information verfügbar.';
    const infoPrefix = langDict[`${type}-info-prefix`] || '';
    const text = (langDict[key] || defaultText) || '';

    if (type === 'stock') {
      const el = document.getElementById('stocks-info');
      if (el) el.textContent = infoPrefix + text;
    }
    if (type === 'crypto') {
      const el = document.getElementById('crypto-info');
      if (el) el.textContent = infoPrefix + text;
    }
    if (type === 'forex') {
      const el = document.getElementById('forex-info');
      if (el) el.textContent = infoPrefix + text;
    }
  } catch (e) { console.warn('showSymbolInfo error', e); }
}
let currentForexTimeframe = '1d';
let currentForexFilter = 'all';

let currentUser = null;
let appInitialized = false;
let currentLang = 'de'; // track currently selected language

// helper to convert our simple language code to a full locale string
function getLocale() {
  return currentLang === 'de' ? 'de-DE' : 'en-US';
}

// number/currency formatting helper
function formatPrice(value, currencyCode = 'USD') {
  try {
    return new Intl.NumberFormat(getLocale(), { style: 'currency', currency: currencyCode }).format(value);
  } catch (e) {
    // fallback to simple formatting
    return (currencyCode === 'EUR' ? '€' : '$') + value;
  }
}


// ========================
// PARTICLE CLASS
// ========================

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = ['#ff6a00', '#ff9100', '#ffffff'][Math.floor(Math.random() * 3)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ========================
// APP INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  // Lade gespeicherten Benutzer falls vorhanden
  const saved = JSON.parse(localStorage.getItem('wirtschaftUser') || 'null');
  setUpAuthHandlers();
  // apply saved language early
  const savedLang = (currentUser && currentUser.lang) || localStorage.getItem('lang') || 'de';
  setLanguage(savedLang);

  // Always init non-sensitive UI parts (background + theme)
  initParticlesBackground();
  setUpThemeToggle();

  if (saved) {
    currentUser = saved;
    finishInit();
  } else {
    // Kein eingeloggter Benutzer -> erzwungene Anmeldung
    currentUser = null;
    // disable navigation until login
    document.querySelectorAll('.tab-btn').forEach(b => b.disabled = true);
    // open auth modal
    openAuthModal(false);
  }
}

function finishInit() {
  if (appInitialized) return;
  appInitialized = true;

  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay && currentUser) usernameDisplay.textContent = currentUser.name;

  setUpTabs();
  updateClock();
  setInterval(updateClock, 1000);
  setUpLogout();

  setTimeout(() => {
    initCharts();
    setUpEventHandlers();
    fetchVonovia();
  }, 100);

  // enable navigation
  document.querySelectorAll('.tab-btn').forEach(b => b.disabled = false);
  // footer about us handlers
  const footerBtn = document.getElementById('footer-about-btn');
  const modal = document.getElementById('about-us-modal');
  const closeBtn = document.getElementById('about-us-close');
  if (footerBtn) footerBtn.addEventListener('click', () => modal && modal.classList.remove('hidden'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal && modal.classList.add('hidden'));
}

// ==============
// i18n / Language
// ==============
const translations = {
  de: {
    'dashboard-btn': 'Dashboard',
    'site-title': 'WirtschaftsPortal',
    'stocks-btn': 'Aktien',
    'crypto-btn': 'Krypto',
    'forex-btn': 'Forex',
    'profile-btn': 'Profil',
    'login-open-btn': 'Anmelden',
    'register-open-btn': 'Registrieren',
    'logout-btn': 'Abmelden',
    'login-title': 'Anmelden',
    'login-email-label': 'Email',
    'login-password-label': 'Passwort',
    'login-submit': 'Anmelden',
    'register-title': 'Registrieren',
    'register-name-label': 'Name',
    'register-email-label': 'Email',
    'register-password-label': 'Passwort',
    'register-submit': 'Registrieren',
    'show-login': 'Zum Login',
    'show-register': 'Zur Registrierung',
    'profile-title': 'Mein Profil',
    'language-label': 'Sprache',
    'about-title': 'Website Creator',
    'about-text': 'Ich heiße Jan-Lukas und bin Software Developer. Diese Website wurde von mir erstellt, um Finanzdaten übersichtlich darzustellen. Ich programmiere in mehreren Sprachen und baue gerne interaktive Webanwendungen.',
    'welcome-title': 'Willkommen zum WirtschaftsPortal!',
    'welcome-date-prefix': 'Heute ist',
    'welcome-time-prefix': 'Uhrzeit',
    'tip-title': 'Tipp des Tages',
    'tip-text': '"Investiere in Wissen – es zahlt die besten Zinsen."',
    'card-stocks-title': 'Aktien',
    'card-crypto-title': 'Kryptowährungen',
    'card-forex-title': 'Forex',
    'card-stocks-desc': 'Überwache beliebte Aktien in Echtzeit mit Live-Charts.',
    'card-crypto-desc': 'Verfolge Bitcoin, Ethereum und andere digitale Assets 24/7.',
    'card-forex-desc': 'Echtzeit-Wechselkurse für alle wichtigen Währungspaare.',
    'time-1d': '1 Tag',
    'time-1w': '1 Woche',
    'time-1m': '1 Monat',
    'time-1y': '1 Jahr',
    'filter-all': 'Alle anzeigen',
    'add-watchlist': 'Zu Favoriten',
    'updates-live': 'Updates: live | ',
    'price-label': 'Preis:',
    'kurs-label': 'Kurs:',
    'user-info-heading': 'Benutzerinformationen',
    'label-name': 'Name:',
    'label-email': 'E-Mail:',
    'label-joined': 'Beigetreten:',
    'settings-heading': 'Einstellungen',
    'auto-refresh-label': 'Auto-Refresh (5s)',
    'notifications-label': 'Benachrichtigungen',
    'theme-heading': 'Design & Themen',
    'predefined-themes': 'Vordefinierte Themen:',
    'apply-button': 'Anwenden',
    'reset-button': 'Zurücksetzen',
    'no-favorites': 'Noch keine Favoriten hinzugefügt',
    'danger-zone': 'Gefahrenzone',
    'delete-account': 'Account löschen',
    'footer-about-btn': 'About Us',
    'stocks-title': 'Aktien - Live Charts',
    'crypto-title': 'Kryptowährungen - Live Charts',
    'forex-title': 'Forex - Währungspaare (Live Charts)',
    'stocks-info-prefix': 'Info: ',
    'crypto-info-prefix': 'Info: ',
    'forex-info-prefix': 'Info: ',
    // info translations
    'stock-info-NVDA': 'NVIDIA Corporation – Grafikprozessoren und KI‑Chips.',
    'stock-info-MSFT': 'Microsoft – Software, Cloud (Azure) und Office‑Suite.',
    'stock-info-NFLX': 'Netflix – Streamingdienst und Medienproduktion.',
    'stock-info-TSLA': 'Tesla – Elektrofahrzeuge und Energiespeicher.',
    'stock-info-PLTR': 'Palantir – Datenanalyse‑ und Softwarelösungen für Unternehmen.',
    'stock-info-AAPL': 'Apple – Consumer‑Elektronik, iPhone, Services.',
    'stock-info-AMZN': 'Amazon – E‑Commerce, AWS Cloud und Logistik.',
    'stock-info-NVO': 'Novo Nordisk – Pharmazeutika, vor allem Diabetes‑Medikamente.',
    'stock-info-VOW': 'Volkswagen (VOW) – Automobilhersteller (Ticker variiert).',
    'stock-info-VNA.DE': 'Vonovia SE – größter Wohnungs‑ und Immobilienkonzern in Deutschland.',
    'stock-info-GOOG': 'Alphabet (Google) – Suchmaschine, Werbung, Cloud und YouTube.',
    'stock-info-META': 'Meta Platforms – Betreiber von Facebook, Instagram und VR‑Produkten.',
    'stock-info-BABA': 'Alibaba – chinesischer E‑Commerce und Cloud‑Anbieter.',
    'stock-info-SAP': 'SAP – Unternehmenssoftware und ERP‑Lösungen.',
    'stock-info-SIE.DE': 'Siemens – Industrie, Automation und Energie.',
    'stock-info-BMW.DE': 'BMW – Premium‑Automobilhersteller.',
    'crypto-info-BTC': 'Bitcoin – dezentrale digitale Währung und Wertaufbewahrung.',
    'crypto-info-ETH': 'Ethereum – Smart‑Contract Plattform und umfangreiche Ökonomie.',
    'crypto-info-SOL': 'Solana – schnelle Smart‑Contract Plattform mit niedrigen Gebühren.',
    'crypto-info-DOT': 'Polkadot – Interoperabilität zwischen Blockchains.',
    'crypto-info-ADA': 'Cardano – forschungsbasierte Smart‑Contract Plattform.',
    'crypto-info-DOGE': 'Dogecoin – meme‑orientierte Kryptowährung.',
    'crypto-info-BNB': 'Binance Coin – native Token der Binance‑Plattform.',
    'crypto-info-XRP': 'XRP – Zahlungs‑ und Überweisungsprotokoll (Ripple).',
    'crypto-info-LTC': 'Litecoin – schnelle, lite Version von Bitcoin.',
    'forex-info-EUR/USD': 'Euro / US‑Dollar – das meistgehandelte Währungspaar.',
    'forex-info-USD/EUR': 'US‑Dollar / Euro – Kehrwert von EUR/USD.',
    'forex-info-GBP/USD': 'Britisches Pfund / US‑Dollar – wichtiger Forex‑Paar.',
    'forex-info-USD/GBP': 'US‑Dollar / Britisches Pfund.',
    'forex-info-USD/JPY': 'US‑Dollar / Japanischer Yen – oft hohe Volatilität.',
    'forex-info-USD/CHF': 'US‑Dollar / Schweizer Franken – Safe‑haven Währung.',
    'forex-info-EUR/GBP': 'Euro / Britisches Pfund – wichtiger europäischer Cross.',
    'forex-info-EUR/JPY': 'Euro / Japanischer Yen.',
    'forex-info-AUD/USD': 'Australischer Dollar / US‑Dollar – Rohstoff‑empfindlich.',
    'forex-info-CAD/USD': 'Kanadischer Dollar / US‑Dollar – Ölpreisabhängig.',
    'forex-info-EUR/CAD': 'Euro / Kanadischer Dollar.',
    'forex-info-NZD/USD': 'Neuseeländischer Dollar / US‑Dollar.',
    'forex-info-USD/SGD': 'US‑Dollar / Singapur-Dollar.'
  },
  en: {
    'dashboard-btn': 'Dashboard',
    'site-title': 'Economy Portal',
    'stocks-btn': 'Stocks',
    'crypto-btn': 'Crypto',
    'forex-btn': 'Forex',
    'profile-btn': 'Profile',
    'login-open-btn': 'Login',
    'register-open-btn': 'Register',
    'logout-btn': 'Logout',
    'login-title': 'Login',
    'login-email-label': 'Email',
    'login-password-label': 'Password',
    'login-submit': 'Login',
    'register-title': 'Register',
    'register-name-label': 'Name',
    'register-email-label': 'Email',
    'register-password-label': 'Password',
    'register-submit': 'Register',
    'show-login': 'To Login',
    'show-register': 'To Register',
    'profile-title': 'My Profile',
    'language-label': 'Language',
    'about-title': 'Website Creator',
    'about-text': 'My name is Jan‑Lukas, I am a Software Developer. I built this site to present financial data clearly. I code in multiple languages and enjoy building interactive web apps.',
    'welcome-title': 'Welcome to the Economy Portal!',
    'welcome-date-prefix': 'Today is',
    'welcome-time-prefix': 'Time',
    'tip-title': 'Tip of the Day',
    'tip-text': '"Invest in knowledge — it pays the best interest."',
    'card-stocks-title': 'Stocks',
    'card-crypto-title': 'Cryptocurrencies',
    'card-forex-title': 'Forex',
    'card-stocks-desc': 'Monitor popular stocks in real time with live charts.',
    'card-crypto-desc': 'Track Bitcoin, Ethereum and other digital assets 24/7.',
    'card-forex-desc': 'Real-time exchange rates for major currency pairs.',
    'time-1d': '1 Day',
    'time-1w': '1 Week',
    'time-1m': '1 Month',
    'time-1y': '1 Year',
    'filter-all': 'Show all',
    'add-watchlist': 'Add to favorites',
    'updates-live': 'Updates: live | ',
    'price-label': 'Price:',
    'kurs-label': 'Rate:',
    'user-info-heading': 'User information',
    'label-name': 'Name:',
    'label-email': 'E-mail:',
    'label-joined': 'Joined:',
    'settings-heading': 'Settings',
    'auto-refresh-label': 'Auto-Refresh (5s)',
    'notifications-label': 'Notifications',
    'theme-heading': 'Design & themes',
    'predefined-themes': 'Predefined themes:',
    'apply-button': 'Apply',
    'reset-button': 'Reset',
    'no-favorites': 'No favorites added yet',
    'danger-zone': 'Danger Zone',
    'delete-account': 'Delete account',
    'footer-about-btn': 'About Us',
    'stocks-title': 'Stocks - Live Charts',
    'crypto-title': 'Cryptocurrencies - Live Charts',
    'forex-title': 'Forex - Currency Pairs (Live Charts)',
    'stocks-info-prefix': 'Info: ',
    'crypto-info-prefix': 'Info: ',
    'forex-info-prefix': 'Info: ',
    // info translations english
    'stock-info-NVDA': 'NVIDIA Corporation – graphics processors and AI chips.',
    'stock-info-MSFT': 'Microsoft – software, cloud (Azure) and Office suite.',
    'stock-info-NFLX': 'Netflix – streaming service and media production.',
    'stock-info-TSLA': 'Tesla – electric vehicles and energy storage.',
    'stock-info-PLTR': 'Palantir – data analytics and enterprise software.',
    'stock-info-AAPL': 'Apple – consumer electronics, iPhone, services.',
    'stock-info-AMZN': 'Amazon – e-commerce, AWS cloud and logistics.',
    'stock-info-NVO': 'Novo Nordisk – pharmaceuticals, especially diabetes drugs.',
    'stock-info-VOW': 'Volkswagen (VOW) – automobile manufacturer (ticker varies).',
    'stock-info-VNA.DE': 'Vonovia SE – largest residential and real estate company in Germany.',
    'stock-info-GOOG': 'Alphabet (Google) – search, advertising, cloud, and YouTube.',
    'stock-info-META': 'Meta Platforms – operator of Facebook, Instagram, and VR products.',
    'stock-info-BABA': 'Alibaba – Chinese e-commerce and cloud provider.',
    'stock-info-SAP': 'SAP – enterprise software and ERP solutions.',
    'stock-info-SIE.DE': 'Siemens – industry, automation, and energy.',
    'stock-info-BMW.DE': 'BMW – premium automobile manufacturer.',
    'crypto-info-BTC': 'Bitcoin – decentralized digital currency and store of value.',
    'crypto-info-ETH': 'Ethereum – smart contract platform with extensive ecosystem.',
    'crypto-info-SOL': 'Solana – fast smart contract platform with low fees.',
    'crypto-info-DOT': 'Polkadot – interoperability between blockchains.',
    'crypto-info-ADA': 'Cardano – research-driven smart contract platform.',
    'crypto-info-DOGE': 'Dogecoin – meme-oriented cryptocurrency.',
    'crypto-info-BNB': 'Binance Coin – native token of the Binance platform.',
    'crypto-info-XRP': 'XRP – payment and transfer protocol (Ripple).',
    'crypto-info-LTC': 'Litecoin – fast, lite version of Bitcoin.',
    'forex-info-EUR/USD': 'Euro / US dollar – the most traded currency pair.',
    'forex-info-USD/EUR': 'US dollar / Euro – inverse of EUR/USD.',
    'forex-info-GBP/USD': 'British pound / US dollar – important forex pair.',
    'forex-info-USD/GBP': 'US dollar / British pound.',
    'forex-info-USD/JPY': 'US dollar / Japanese yen – often high volatility.',
    'forex-info-USD/CHF': 'US dollar / Swiss franc – safe-haven currency.',
    'forex-info-EUR/GBP': 'Euro / British pound – important European cross.',
    'forex-info-EUR/JPY': 'Euro / Japanese yen.',
    'forex-info-AUD/USD': 'Australian dollar / US dollar – commodity-sensitive.',
    'forex-info-CAD/USD': 'Canadian dollar / US dollar – oil-dependent.',
    'forex-info-EUR/CAD': 'Euro / Canadian dollar.',
    'forex-info-NZD/USD': 'New Zealand dollar / US dollar.',
    'forex-info-USD/SGD': 'US dollar / Singapore dollar.'
    , 'logout-confirm': 'Do you want to exit the app?'
  }
};

function setLanguage(lang) {
  try {
    currentLang = lang || 'de';
    const dict = translations[currentLang] || translations.de;
    // update static elements
    Object.keys(dict).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      // special-case prefixes
      if (id.endsWith('-info-prefix')) return; // handled below
      el.textContent = dict[id];
    });

    // also apply translations for elements using data-i18n attributes
    try {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        if (dict[key] !== undefined) el.textContent = dict[key];
      });
    } catch (e) { /* safe-ignore */ }
    // update info prefixes (prefix text may change language but actual info will be refreshed separately)
    const stocksInfo = document.getElementById('stocks-info');
    const cryptoInfo = document.getElementById('crypto-info');
    const forexInfo = document.getElementById('forex-info');
    if (stocksInfo) stocksInfo.textContent = (dict['stocks-info-prefix'] || '') + stocksInfo.textContent.split(': ').slice(1).join(': ');
    if (cryptoInfo) cryptoInfo.textContent = (dict['crypto-info-prefix'] || '') + cryptoInfo.textContent.split(': ').slice(1).join(': ');
    if (forexInfo) forexInfo.textContent = (dict['forex-info-prefix'] || '') + forexInfo.textContent.split(': ').slice(1).join(': ');

    // reformat dynamic numbers and refresh info text
    refreshSymbolInfos();
    refreshPriceDisplays();

    // set select value
    const sel = document.getElementById('language-select');
    if (sel) sel.value = currentLang;

    localStorage.setItem('lang', currentLang);
    if (currentUser) { currentUser.lang = currentLang; localStorage.setItem('wirtschaftUser', JSON.stringify(currentUser)); }
  } catch (e) { console.warn('setLanguage error', e); }
}

// wire language selector
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('language-select');
  if (sel) sel.addEventListener('change', (e) => setLanguage(e.target.value));
});


// ========================
// PARTICLES BACKGROUND
// ========================

function initParticlesBackground() {
  try {
    canvas = document.getElementById('background');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
  } catch (e) {
    console.error('Particle init error:', e);
  }
}

function initParticles() {
  particlesArray = [];
  if (canvas) {
    for (let i = 0; i < 150; i++) {
      particlesArray.push(new Particle());
    }
  }
}

function animate() {
  if (!canvas || !ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

// ========================
// TABS & UI
// ========================

function setUpTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.tab-content');
  
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      sections.forEach(sec => sec.classList.add('hidden'));
      const tabId = btn.dataset.tab;
      const tabElement = document.getElementById(tabId);
      if (tabElement) tabElement.classList.remove('hidden');
      
      setTimeout(() => {
        if (stockChart) stockChart.resize();
        if (cryptoChart) cryptoChart.resize();
        if (forexChart) forexChart.resize();
      }, 100);
    });
  });
  
  const dashElement = document.getElementById('dashboard');
  if (dashElement) dashElement.classList.remove('hidden');
}

function setUpThemeToggle() {
  const btn = document.getElementById('toggle-theme');
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
  }
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light');
  }
}

function updateClock() {
  const now = new Date();
  const clockElement = document.getElementById('clock');
  const dateElement = document.getElementById('date');
  
  if (clockElement) clockElement.textContent = now.toLocaleTimeString(getLocale());
  if (dateElement) dateElement.textContent = now.toLocaleDateString(getLocale());
}

// ========================
// AUTH HANDLERS
// ========================

function setUpLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const msg = (translations[currentLang] && translations[currentLang]['logout-confirm']) || 'Möchtest du die App beenden?';
      if (confirm(msg)) {
        location.reload();
      }
    });
  }
}

// ========================
// AUTH MODAL + API
// ========================

function setUpAuthHandlers() {
  const loginOpen = document.getElementById('login-open-btn');
  const registerOpen = document.getElementById('register-open-btn');
  const modal = document.getElementById('auth-modal');
  const modalClose = document.getElementById('modal-close');
  const showLoginBtn = document.getElementById('show-login');
  const showRegisterBtn = document.getElementById('show-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginOpen) loginOpen.addEventListener('click', () => openAuthModal(false));
  if (registerOpen) registerOpen.addEventListener('click', () => openAuthModal(true));
  if (modalClose) modalClose.addEventListener('click', closeAuthModal);
  if (showLoginBtn) showLoginBtn.addEventListener('click', () => toggleAuthForms(false));
  if (showRegisterBtn) showRegisterBtn.addEventListener('click', () => toggleAuthForms(true));

  if (loginForm) loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Login fehlgeschlagen');
      currentUser = data.user;
      localStorage.setItem('wirtschaftUser', JSON.stringify(currentUser));
      // also save to users list in localStorage for older code compatibility
      const all = JSON.parse(localStorage.getItem('wirtschaftUsers') || '[]');
      const idx = all.findIndex(u => u.id === currentUser.id);
      if (idx >= 0) all[idx] = currentUser; else all.push(currentUser);
      localStorage.setItem('wirtschaftUsers', JSON.stringify(all));
      loadProfileData();
      const usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) usernameDisplay.textContent = currentUser.name;
      closeAuthModal();
      finishInit();
    } catch (e) { alert('Fehler beim Login'); }
  });

  if (registerForm) registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Registrierung fehlgeschlagen');
      currentUser = data.user;
      localStorage.setItem('wirtschaftUser', JSON.stringify(currentUser));
      const all = JSON.parse(localStorage.getItem('wirtschaftUsers') || '[]');
      const idx = all.findIndex(u => u.id === currentUser.id);
      if (idx >= 0) all[idx] = currentUser; else all.push(currentUser);
      localStorage.setItem('wirtschaftUsers', JSON.stringify(all));
      loadProfileData();
      const usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) usernameDisplay.textContent = currentUser.name;
      closeAuthModal();
      finishInit();
    } catch (e) { alert('Fehler bei der Registrierung'); }
  });
}

function openAuthModal(showRegister) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  toggleAuthForms(showRegister);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('hidden');
}

function toggleAuthForms(showRegister) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (showRegister) {
    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.remove('hidden');
  } else {
    if (loginForm) loginForm.classList.remove('hidden');
    if (registerForm) registerForm.classList.add('hidden');
  }
}

// Fetch Vonovia from backend and update price shown in UI
async function fetchVonovia() {
  try {
    const res = await fetch('/api/stock/vonovia');
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.price) {
      stockPrices['VNA.DE'] = Math.round(data.price * 100) / 100;
      // if currently selected symbol is VNA.DE show price
      const displaySymbol = currentStockFilter === 'all' ? stockSymbols[0] : currentStockFilter;
      if (displaySymbol === 'VNA.DE') {
        const priceElement = document.getElementById('stocks-price');
        if (priceElement) priceElement.textContent = `VNA.DE: ${formatPrice(stockPrices['VNA.DE'], 'EUR')}`;
      }
    }
  } catch (e) {
    console.warn('Vonovia fetch failed', e);
  }
}

// periodically update Vonovia price
setInterval(fetchVonovia, 15000);

// helper to re-show info texts after language change or symbol change
function refreshSymbolInfos() {
  try {
    const stockSymbol = currentStockFilter === 'all' ? stockSymbols[0] : currentStockFilter;
    showSymbolInfo('stock', stockSymbol);
    const cryptoSymbol = currentCryptoFilter === 'all' ? cryptoSymbols[0] : currentCryptoFilter;
    showSymbolInfo('crypto', cryptoSymbol);
    const forexSymbol = currentForexFilter === 'all' ? forexPairs[0].join('/') : currentForexFilter;
    showSymbolInfo('forex', forexSymbol);
  } catch (e) {
    console.warn('refreshSymbolInfos error', e);
  }
}

// helper to rewrite currently displayed prices using language-specific formatting
function refreshPriceDisplays() {
  try {
    // stocks
    const stockDisplay = currentStockFilter === 'all' ? stockSymbols[0] : currentStockFilter;
    const stockIdx = stockSymbols.indexOf(stockDisplay);
    if (stockIdx >= 0) {
      const price = stockPrices[stockDisplay];
      const priceEl = document.getElementById('stocks-price');
      if (priceEl) {
        const curr = stockDisplay === 'VNA.DE' ? 'EUR' : 'USD';
        priceEl.textContent = `${stockDisplay}: ${formatPrice(price, curr)}`;
      }
    }
    // crypto
    const cryptoDisplay = currentCryptoFilter === 'all' ? cryptoSymbols[0] : currentCryptoFilter;
    const cryptoIdx = cryptoSymbols.indexOf(cryptoDisplay);
    if (cryptoIdx >= 0) {
      const price = cryptoPrices[cryptoDisplay];
      const priceEl = document.getElementById('crypto-price');
      if (priceEl) {
        priceEl.textContent = `${cryptoDisplay}: ${formatPrice(price, 'USD')}`;
      }
    }
    // forex
    const forexDisplay = currentForexFilter === 'all' ? forexPairs[0].join('/') : currentForexFilter;
    const rate = forexRates[forexDisplay];
    const forexEl = document.getElementById('forex-price');
    if (forexEl && rate !== undefined) {
      forexEl.textContent = `${forexDisplay}: ${rate.toLocaleString(getLocale(), {minimumFractionDigits:4, maximumFractionDigits:4})}`;
    }
  } catch (e) {
    console.warn('refreshPriceDisplays error', e);
  }
}

// ========================
// UTILITY FUNCTIONS
// ========================

function generateMockPrice(basePrice, volatility = 0.03) {
  const change = (Math.random() - 0.5) * volatility * basePrice;
  return Math.max(basePrice + change, basePrice * 0.5);
}

// ========================
// CHARTS SETUP
// ========================

function initCharts() {
  if (typeof Chart === 'undefined') {
    setTimeout(initCharts, 100);
    return;
  }

  try {
    const stockElem = document.getElementById('chart-stocks');
    if (stockElem) stockChartCtx = stockElem.getContext('2d');
  } catch (e) {
    console.error('Stock chart context error:', e);
  }
  
  try {
    const cryptoElem = document.getElementById('chart-crypto');
    if (cryptoElem) cryptoChartCtx = cryptoElem.getContext('2d');
  } catch (e) {
    console.error('Crypto chart context error:', e);
  }
  
  try {
    const forexElem = document.getElementById('chart-forex');
    if (forexElem) forexChartCtx = forexElem.getContext('2d');
  } catch (e) {
    console.error('Forex chart context error:', e);
  }

  if (stockChartCtx) {
    initStockData();
    setInterval(updateStocks, 5000);
  }

  if (cryptoChartCtx) {
    initCryptoData();
    setInterval(updateCrypto, 5000);
  }

  if (forexChartCtx) {
    initForexData();
    setInterval(updateForex, 5000);
  }
  
  loadProfileData();
}

// ========================
// STOCKS
// ========================

function generateStockData(timeframe) {
  const labels = [];
  const dataPoints = { '1d': 24, '1w': 7, '1m': 30, '1y': 52 }[timeframe] || 24;
  const labelFormats = {
    '1d': (i) => new Date(Date.now() - (dataPoints - i) * 3600000).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }),
    '1w': (i) => new Date(Date.now() - (dataPoints - i) * 86400000).toLocaleDateString(getLocale()),
    '1m': (i) => new Date(Date.now() - (dataPoints - i) * 86400000).toLocaleDateString(getLocale(), { month: 'short', day: 'numeric' }),
    '1y': (i) => new Date(Date.now() - (dataPoints - i) * 604800000).toLocaleDateString(getLocale(), { month: 'short' })
  }[timeframe];

  for (let i = 0; i < dataPoints; i++) labels.push(labelFormats(i));

  const datasets = stockSymbols.map(s => {
    const data = [];
    let basePrice = stockPrices[s];
    for (let i = 0; i < dataPoints; i++) {
      data.push(Math.round(generateMockPrice(basePrice, 0.01) * 100) / 100);
    }
    return {
      label: s,
      data: data,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: false,
      tension: 0.4,
      borderWidth: 2
    };
  });

  return { labels, datasets };
}

function initStockData() {
  if (stockChart && typeof stockChart.destroy === 'function') {
    stockChart.destroy();
  }
  const data = generateStockData(currentStockTimeframe);
  stockChart = new Chart(stockChartCtx, {
    type: 'line',
    data: { labels: data.labels, datasets: data.datasets },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 1000 }, scales: { y: { beginAtZero: false } }, plugins: { legend: { display: true, position: 'top' } } }
  });
  filterStockDatasets();
  stockChart.update();
  updateStocks();
  // Show info for the currently displayed symbol
  const displaySymbol = currentStockFilter === 'all' ? stockSymbols[0] : currentStockFilter;
  showSymbolInfo('stock', displaySymbol);
}

function filterStockDatasets() {
  if (!stockChart) return;
  if (currentStockFilter === 'all') {
    stockChart.data.datasets.forEach(d => d.hidden = false);
  } else {
    stockChart.data.datasets.forEach(d => {
      d.hidden = d.label !== currentStockFilter;
    });
  }
}

async function updateStocks() {
  if (!stockChart) return;
  for (let i = 0; i < stockSymbols.length; i++) {
    const symbol = stockSymbols[i];
    stockPrices[symbol] = generateMockPrice(stockPrices[symbol], 0.02);
    const price = stockPrices[symbol];
    if (stockChart.data.datasets[i]) {
      const lastIdx = stockChart.data.datasets[i].data.length - 1;
      stockChart.data.datasets[i].data[lastIdx] = Math.round(price * 100) / 100;
    }
  }
  const displaySymbol = currentStockFilter === 'all' ? stockSymbols[0] : currentStockFilter;
  const idx = stockSymbols.indexOf(displaySymbol);
  if (idx >= 0 && stockChart.data.datasets[idx]) {
    const price = stockChart.data.datasets[idx].data[stockChart.data.datasets[idx].data.length - 1];
    const priceElement = document.getElementById('stocks-price');
    if (priceElement) {
      const curr = displaySymbol === 'VNA.DE' ? 'EUR' : 'USD';
      priceElement.textContent = `${displaySymbol}: ${formatPrice(price, curr)}`;
    }
  }
  stockChart.update();
}

// ========================
// CRYPTO
// ========================

function generateCryptoData(timeframe) {
  const labels = [];
  const dataPoints = { '1d': 24, '1w': 7, '1m': 30, '1y': 52 }[timeframe] || 24;
  const labelFormats = {
    '1d': (i) => new Date(Date.now() - (dataPoints - i) * 3600000).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }),
    '1w': (i) => new Date(Date.now() - (dataPoints - i) * 86400000).toLocaleDateString(getLocale()),
    '1m': (i) => new Date(Date.now() - (dataPoints - i) * 86400000).toLocaleDateString(getLocale(), { month: 'short', day: 'numeric' }),
    '1y': (i) => new Date(Date.now() - (dataPoints - i) * 604800000).toLocaleDateString(getLocale(), { month: 'short' })
  }[timeframe];

  for (let i = 0; i < dataPoints; i++) labels.push(labelFormats(i));

  const datasets = cryptoSymbols.map(s => {
    const data = [];
    let basePrice = cryptoPrices[s];
    for (let i = 0; i < dataPoints; i++) {
      data.push(Math.round(generateMockPrice(basePrice, 0.03) * 100) / 100);
    }
    return {
      label: s,
      data: data,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: false,
      tension: 0.4,
      borderWidth: 2
    };
  });

  return { labels, datasets };
}

function initCryptoData() {
  if (cryptoChart && typeof cryptoChart.destroy === 'function') {
    cryptoChart.destroy();
  }
  const data = generateCryptoData(currentCryptoTimeframe);
  cryptoChart = new Chart(cryptoChartCtx, {
    type: 'line',
    data: { labels: data.labels, datasets: data.datasets },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 1000 }, scales: { y: { beginAtZero: false } }, plugins: { legend: { display: true, position: 'top' } } }
  });
  filterCryptoDatasets();
  cryptoChart.update();
  updateCrypto();
  const displayCrypto = currentCryptoFilter === 'all' ? cryptoSymbols[0] : currentCryptoFilter;
  showSymbolInfo('crypto', displayCrypto);
}

function filterCryptoDatasets() {
  if (!cryptoChart) return;
  if (currentCryptoFilter === 'all') {
    cryptoChart.data.datasets.forEach(d => d.hidden = false);
  } else {
    cryptoChart.data.datasets.forEach(d => {
      d.hidden = d.label !== currentCryptoFilter;
    });
  }
}

async function updateCrypto() {
  if (!cryptoChart) return;
  for (let i = 0; i < cryptoSymbols.length; i++) {
    const symbol = cryptoSymbols[i];
    cryptoPrices[symbol] = generateMockPrice(cryptoPrices[symbol], 0.03);
    const price = cryptoPrices[symbol];
    if (cryptoChart.data.datasets[i]) {
      const lastIdx = cryptoChart.data.datasets[i].data.length - 1;
      cryptoChart.data.datasets[i].data[lastIdx] = Math.round(price * 100) / 100;
    }
  }
  const displaySymbol = currentCryptoFilter === 'all' ? cryptoSymbols[0] : currentCryptoFilter;
  const idx = cryptoSymbols.indexOf(displaySymbol);
  if (idx >= 0 && cryptoChart.data.datasets[idx]) {
    const price = cryptoChart.data.datasets[idx].data[cryptoChart.data.datasets[idx].data.length - 1];
    const priceElement = document.getElementById('crypto-price');
    if (priceElement) priceElement.textContent = `${displaySymbol}: ${formatPrice(price, 'USD')}`;
  }
  cryptoChart.update();
}

// ========================
// FOREX
// ========================

function generateForexData(timeframe) {
  const labels = [];
  const dataPoints = { '1d': 24, '1w': 7, '1m': 30, '1y': 52 }[timeframe] || 24;
  const labelFormats = {
    '1d': (i) => new Date(Date.now() - (dataPoints - i) * 3600000).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }),
    '1w': (i) => new Date(Date.now() - (dataPoints - i) * 86400000).toLocaleDateString(getLocale()),
    '1m': (i) => new Date(Date.now() - (dataPoints - i) * 86400000).toLocaleDateString(getLocale(), { month: 'short', day: 'numeric' }),
    '1y': (i) => new Date(Date.now() - (dataPoints - i) * 604800000).toLocaleDateString(getLocale(), { month: 'short' })
  }[timeframe];

  for (let i = 0; i < dataPoints; i++) labels.push(labelFormats(i));

  const datasets = forexPairs.map(p => {
    const data = [];
    let baseRate = forexRates[p.join('/')];
    for (let i = 0; i < dataPoints; i++) {
      data.push(Math.round(generateMockPrice(baseRate, 0.005) * 10000) / 10000);
    }
    return {
      label: p.join('/'),
      data: data,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fill: false,
      tension: 0.4,
      borderWidth: 2
    };
  });

  return { labels, datasets };
}

function initForexData() {
  if (forexChart && typeof forexChart.destroy === 'function') {
    forexChart.destroy();
  }
  const data = generateForexData(currentForexTimeframe);
  forexChart = new Chart(forexChartCtx, {
    type: 'line',
    data: { labels: data.labels, datasets: data.datasets },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 1000 }, scales: { y: { beginAtZero: false } }, plugins: { legend: { display: true, position: 'top' } } }
  });
  filterForexDatasets();
  forexChart.update();
  updateForex();
  const displayForex = currentForexFilter === 'all' ? forexPairs[0].join('/') : currentForexFilter;
  showSymbolInfo('forex', displayForex);
}

function filterForexDatasets() {
  if (!forexChart) return;
  if (currentForexFilter === 'all') {
    forexChart.data.datasets.forEach(d => d.hidden = false);
  } else {
    forexChart.data.datasets.forEach(d => {
      d.hidden = d.label !== currentForexFilter;
    });
  }
}

async function updateForex() {
  if (!forexChart) return;
  for (let i = 0; i < forexPairs.length; i++) {
    const [from, to] = forexPairs[i];
    const pair = `${from}/${to}`;
    forexRates[pair] = generateMockPrice(forexRates[pair], 0.005);
    const rate = forexRates[pair];
    if (forexChart.data.datasets[i]) {
      const lastIdx = forexChart.data.datasets[i].data.length - 1;
      forexChart.data.datasets[i].data[lastIdx] = Math.round(rate * 10000) / 10000;
    }
  }
  const displayPair = currentForexFilter === 'all' ? forexPairs[0].join('/') : currentForexFilter;
  const idx = forexChart.data.datasets.findIndex(d => d.label === displayPair);
  if (idx >= 0 && forexChart.data.datasets[idx]) {
    const rate = forexChart.data.datasets[idx].data[forexChart.data.datasets[idx].data.length - 1];
    const priceElement = document.getElementById('forex-price');
    if (priceElement) priceElement.textContent = `${displayPair}: ${rate.toLocaleString(getLocale(), {minimumFractionDigits:4, maximumFractionDigits:4})}`;
  }
  forexChart.update();
}

// ========================
// EVENT HANDLERS
// ========================

function setUpEventHandlers() {
  setTimeout(() => {
    // Stock Buttons
    document.querySelectorAll('#stocks .time-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#stocks .time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentStockTimeframe = this.dataset.time;
        initStockData();
      });
    });

    document.querySelectorAll('#stocks .symbol-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#stocks .symbol-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentStockFilter = this.dataset.symbol;
        filterStockDatasets();
        if (stockChart) stockChart.update();
        const displaySymbol = currentStockFilter === 'all' ? stockSymbols[0] : currentStockFilter;
        const idx = stockSymbols.indexOf(displaySymbol);
        if (idx >= 0 && stockChart.data.datasets[idx]) {
          const price = stockChart.data.datasets[idx].data[stockChart.data.datasets[idx].data.length - 1];
          const priceElement = document.getElementById('stocks-price');
          if (priceElement) {
            const curr = displaySymbol === 'VNA.DE' ? 'EUR' : 'USD';
            priceElement.textContent = `${displaySymbol}: ${formatPrice(price, curr)}`;
          }
          showSymbolInfo('stock', displaySymbol);
        }
      });
    });

    // Crypto Buttons
    document.querySelectorAll('#crypto .time-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#crypto .time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCryptoTimeframe = this.dataset.time;
        initCryptoData();
      });
    });

    document.querySelectorAll('#crypto .symbol-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#crypto .symbol-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCryptoFilter = this.dataset.symbol;
        filterCryptoDatasets();
        if (cryptoChart) cryptoChart.update();
        const displaySymbol = currentCryptoFilter === 'all' ? cryptoSymbols[0] : currentCryptoFilter;
        const idx = cryptoSymbols.indexOf(displaySymbol);
        if (idx >= 0 && cryptoChart.data.datasets[idx]) {
          const price = cryptoChart.data.datasets[idx].data[cryptoChart.data.datasets[idx].data.length - 1];
          const priceElement = document.getElementById('crypto-price');
          if (priceElement) priceElement.textContent = `${displaySymbol}: ${formatPrice(price, 'USD')}`;
          showSymbolInfo('crypto', displaySymbol);
        }
      });
    });

    // Forex Buttons
    document.querySelectorAll('#forex .time-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#forex .time-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentForexTimeframe = this.dataset.time;
        initForexData();
      });
    });

    document.querySelectorAll('#forex .symbol-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#forex .symbol-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentForexFilter = this.dataset.symbol;
        filterForexDatasets();
        if (forexChart) forexChart.update();
        const displayPair = currentForexFilter === 'all' ? forexPairs[0].join('/') : currentForexFilter;
        const idx = forexChart.data.datasets.findIndex(d => d.label === displayPair);
        if (idx >= 0 && forexChart.data.datasets[idx]) {
          const rate = forexChart.data.datasets[idx].data[forexChart.data.datasets[idx].data.length - 1];
          const priceElement = document.getElementById('forex-price');
          if (priceElement) priceElement.textContent = `${displayPair}: ${rate.toLocaleString(getLocale(), {minimumFractionDigits:4, maximumFractionDigits:4})}`;
          showSymbolInfo('forex', displayPair);
        }
      });
    });

    // Watchlist buttons
    document.querySelectorAll('.add-watchlist-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const type = this.dataset.type;
        const currentFilter = type === 'stock' ? currentStockFilter : type === 'crypto' ? currentCryptoFilter : currentForexFilter;
        if (currentFilter === 'all') {
          alert('Bitte wähle ein spezifisches Symbol aus');
        } else {
          addToWatchlist(type, currentFilter);
        }
      });
    });

  }, 300);
}

// ========================
// WATCHLIST / FAVORITES
// ========================

function addToWatchlist(type, symbol) {
  const item = { type, symbol, addedAt: new Date().toLocaleString('de-DE') };
  
  if (currentUser.watchlist.find(w => w.type === type && w.symbol === symbol)) {
    alert('Dieses Symbol ist bereits in den Favoriten');
    return;
  }
  
  currentUser.watchlist.push(item);
  localStorage.setItem('wirtschaftUser', JSON.stringify(currentUser));
  
  const allUsers = JSON.parse(localStorage.getItem('wirtschaftUsers') || '[]');
  const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
  if (userIndex >= 0) {
    allUsers[userIndex] = currentUser;
    localStorage.setItem('wirtschaftUsers', JSON.stringify(allUsers));
  }
  
  alert(`${symbol} zu Favoriten hinzugefügt`);
  loadProfileData();
}

function removeFromWatchlist(type, symbol) {
  currentUser.watchlist = currentUser.watchlist.filter(w => !(w.type === type && w.symbol === symbol));
  localStorage.setItem('wirtschaftUser', JSON.stringify(currentUser));
  
  const allUsers = JSON.parse(localStorage.getItem('wirtschaftUsers') || '[]');
  const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
  if (userIndex >= 0) {
    allUsers[userIndex] = currentUser;
    localStorage.setItem('wirtschaftUsers', JSON.stringify(allUsers));
  }
  
  loadProfileData();
}

function loadProfileData() {
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profileJoined = document.getElementById('profile-joined');
  
  if (profileName && currentUser) profileName.value = currentUser.name;
  if (profileEmail && currentUser) profileEmail.value = currentUser.email;
  if (profileJoined && currentUser) profileJoined.value = currentUser.joined;

  const container = document.getElementById('watchlist-container');
  if (container) {
    if (currentUser && currentUser.watchlist && currentUser.watchlist.length > 0) {
      container.innerHTML = currentUser.watchlist.map(item => `
        <div class="watchlist-item">
          <span>${item.symbol} (${item.type})</span>
          <button onclick="removeFromWatchlist('${item.type}', '${item.symbol}')">x</button>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p style="opacity: 0.7;">Noch keine Favoriten hinzugefügt</p>';
    }
  }
}

// ========================
// THEME SYSTEM
// ========================

const themeColors = {
  'theme-orange': { primary1: '#ff6a00', primary2: '#ff9100', light: '#ffb800' },
  'theme-blue': { primary1: '#0066ff', primary2: '#0088ff', light: '#00aaff' },
  'theme-green': { primary1: '#00cc66', primary2: '#00dd77', light: '#00ff88' },
  'theme-red': { primary1: '#ff3333', primary2: '#ff5555', light: '#ff7777' },
  'theme-purple': { primary1: '#9933ff', primary2: '#aa44ff', light: '#bb55ff' },
  'theme-pink': { primary1: '#ff1493', primary2: '#ff4199', light: '#ff66bb' },
  'theme-cyan': { primary1: '#00ffff', primary2: '#33ffff', light: '#66ffff' },
  'theme-teal': { primary1: '#00a8a8', primary2: '#00c9c9', light: '#00e5e5' }
};

function initThemeSystem() {
  // Load saved theme
  const savedTheme = localStorage.getItem('selectedTheme') || 'theme-orange';
  applyTheme(savedTheme);
  
  // Theme button handlers
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const theme = this.dataset.theme;
      applyTheme(theme);
      localStorage.setItem('selectedTheme', theme);
    });
  });
  
  // Custom color picker
  const colorPicker = document.getElementById('custom-color-picker');
  const applyBtn = document.getElementById('apply-custom-color-btn');
  const resetBtn = document.getElementById('reset-color-btn');
  
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const color = colorPicker.value;
      applyCustomTheme(color);
      localStorage.setItem('customThemeColor', color);
      
      // Mark all theme buttons as inactive
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('customThemeColor');
      const savedTheme = localStorage.getItem('selectedTheme') || 'theme-orange';
      applyTheme(savedTheme);
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`[data-theme="${savedTheme}"]`).classList.add('active');
    });
  }
}

function applyTheme(themeName) {
  const root = document.documentElement;
  const colors = themeColors[themeName];
  
  if (colors) {
    root.classList.remove('theme-blue', 'theme-green', 'theme-red', 'theme-purple', 'theme-pink', 'theme-cyan', 'theme-teal');
    root.classList.add(themeName);
    
    root.style.setProperty('--primary-color-1', colors.primary1);
    root.style.setProperty('--primary-color-2', colors.primary2);
    root.style.setProperty('--primary-color-light', colors.light);
    
    // Extract RGB values
    const rgb = hexToRgb(colors.primary1);
    root.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  }
}

function applyCustomTheme(colorHex) {
  const root = document.documentElement;
  
  // Generate lighter and darker shades
  const color1 = colorHex;
  const color2 = adjustBrightness(colorHex, 20);
  const colorLight = adjustBrightness(colorHex, 40);
  
  root.classList.remove('theme-blue', 'theme-green', 'theme-red', 'theme-purple', 'theme-pink', 'theme-cyan', 'theme-teal', 'theme-orange');
  
  root.style.setProperty('--primary-color-1', color1);
  root.style.setProperty('--primary-color-2', color2);
  root.style.setProperty('--primary-color-light', colorLight);
  
  const rgb = hexToRgb(color1);
  root.style.setProperty('--primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 106, b: 0 };
}

function adjustBrightness(color, percent) {
  const rgb = hexToRgb(color);
  const r = Math.round(Math.min(255, rgb.r + (255 - rgb.r) * percent / 100));
  const g = Math.round(Math.min(255, rgb.g + (255 - rgb.g) * percent / 100));
  const b = Math.round(Math.min(255, rgb.b + (255 - rgb.b) * percent / 100));
  return '#' + [r, g, b].map(x => (' 0' + x.toString(16)).slice(-2)).join('');
}

// Initialize theme system when app loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initThemeSystem, 100);
});
