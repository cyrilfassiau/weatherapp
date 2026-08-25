/**
 * UI strings. Weather *descriptions* are not translated here — OpenWeatherMap
 * localizes those itself via the `lang` query param, so they arrive ready to
 * display in the active language.
 */

const en = {
  appName: 'Skycast',
  searchLabel: 'Search for a city',
  searchPlaceholder: 'Search for a city…',
  searchHint: 'Type at least two letters',
  noResults: 'No cities match that search.',
  useMyLocation: 'Use my location',
  locating: 'Finding you…',
  save: 'Save this city',
  saved: 'Saved',
  unsave: 'Remove from saved',
  savedCities: 'Saved cities',
  feelsLike: 'Feels like',
  humidity: 'Humidity',
  dewPoint: 'Dew point',
  wind: 'Wind',
  gusting: 'gusting {value}',
  pressure: 'Pressure',
  visibility: 'Visibility',
  cloudCover: 'Cloud cover',
  clearView: 'clear',
  vsActual: '{value} vs actual',
  precipitation: 'Precipitation',
  chanceOfRain: 'Chance of rain',
  next24h: 'Next 24 hours',
  threeHourly: '3-hourly, the finest resolution the free forecast provides',
  fiveDay: '5-day forecast',
  today: 'Today',
  tonight: 'Tonight',
  high: 'High',
  low: 'Low',
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  dayLength: 'Day length',
  untilSunrise: 'until sunrise',
  untilSunset: 'until sunset',
  temperature: 'Temperature',
  units: 'Units',
  theme: 'Theme',
  language: 'Language',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  retry: 'Try again',
  loading: 'Loading weather',
  updated: 'Updated {value}',
  localTime: 'Local time',
  emptyTitle: 'Where are you looking?',
  emptyBody: 'Search for a city or use your location to see current conditions and the five-day forecast.',
  errorNotFound: 'We could not find that place. Check the spelling, or pick a suggestion from the list.',
  errorBadKey: 'That API key was rejected. A brand-new OpenWeatherMap key can take a couple of hours to activate.',
  errorMissingKey: 'No API key configured. Copy .env.example to .env and add your OpenWeatherMap key.',
  errorRateLimit: 'Too many requests — the free tier allows 60 calls a minute. Give it a moment.',
  errorOffline: 'Could not reach OpenWeatherMap. Check your connection and try again.',
  errorUnknown: 'Something went wrong fetching the weather.',
  geoDenied: 'Location permission was denied. Search for a city instead.',
  geoUnavailable: 'Your location is not available right now.',
  expand: 'Show hourly detail',
  collapse: 'Hide hourly detail',
  calm: 'Calm',
  lightBreeze: 'Light breeze',
  moderateBreeze: 'Moderate breeze',
  strongBreeze: 'Strong breeze',
  gale: 'Gale',
  storm: 'Storm force',
  dataFrom: 'Data from OpenWeatherMap',
};

const fr = {
  appName: 'Skycast',
  searchLabel: 'Rechercher une ville',
  searchPlaceholder: 'Rechercher une ville…',
  searchHint: 'Saisissez au moins deux lettres',
  noResults: 'Aucune ville ne correspond à cette recherche.',
  useMyLocation: 'Ma position',
  locating: 'Localisation…',
  save: 'Enregistrer cette ville',
  saved: 'Enregistrée',
  unsave: 'Retirer des favoris',
  savedCities: 'Villes enregistrées',
  feelsLike: 'Ressenti',
  humidity: 'Humidité',
  dewPoint: 'Point de rosée',
  wind: 'Vent',
  gusting: 'rafales {value}',
  pressure: 'Pression',
  visibility: 'Visibilité',
  cloudCover: 'Nébulosité',
  clearView: 'dégagée',
  vsActual: '{value} par rapport au réel',
  precipitation: 'Précipitations',
  chanceOfRain: 'Risque de pluie',
  next24h: 'Prochaines 24 heures',
  threeHourly: 'Toutes les 3 heures, la meilleure résolution offerte par l’API gratuite',
  fiveDay: 'Prévisions sur 5 jours',
  today: "Aujourd'hui",
  tonight: 'Cette nuit',
  high: 'Max',
  low: 'Min',
  sunrise: 'Lever',
  sunset: 'Coucher',
  dayLength: 'Durée du jour',
  untilSunrise: 'avant le lever',
  untilSunset: 'avant le coucher',
  temperature: 'Température',
  units: 'Unités',
  theme: 'Thème',
  language: 'Langue',
  light: 'Clair',
  dark: 'Sombre',
  system: 'Système',
  retry: 'Réessayer',
  loading: 'Chargement de la météo',
  updated: 'Mis à jour à {value}',
  localTime: 'Heure locale',
  emptyTitle: 'Où regardez-vous ?',
  emptyBody: 'Recherchez une ville ou utilisez votre position pour voir les conditions actuelles et les prévisions sur cinq jours.',
  errorNotFound: 'Lieu introuvable. Vérifiez l’orthographe ou choisissez une suggestion.',
  errorBadKey: 'Clé API refusée. Une nouvelle clé OpenWeatherMap peut mettre quelques heures à s’activer.',
  errorMissingKey: 'Aucune clé API configurée. Copiez .env.example vers .env et ajoutez votre clé OpenWeatherMap.',
  errorRateLimit: 'Trop de requêtes — l’offre gratuite autorise 60 appels par minute. Patientez un instant.',
  errorOffline: 'Impossible de joindre OpenWeatherMap. Vérifiez votre connexion.',
  errorUnknown: 'Une erreur est survenue lors de la récupération de la météo.',
  geoDenied: 'Autorisation de localisation refusée. Recherchez plutôt une ville.',
  geoUnavailable: 'Votre position n’est pas disponible pour le moment.',
  expand: 'Afficher le détail horaire',
  collapse: 'Masquer le détail horaire',
  calm: 'Calme',
  lightBreeze: 'Brise légère',
  moderateBreeze: 'Brise modérée',
  strongBreeze: 'Vent fort',
  gale: 'Coup de vent',
  storm: 'Tempête',
  dataFrom: 'Données OpenWeatherMap',
};

const TABLES = { en, fr };

export const LANGUAGES = [
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'fr', label: 'Français', short: 'FR' },
];

/** Returns a `t(key, vars)` lookup for the given language, falling back to English. */
export function translator(lang) {
  const table = TABLES[lang] ?? en;
  return (key, vars) => {
    let value = table[key] ?? en[key] ?? key;
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replace(`{${name}}`, replacement);
      }
    }
    return value;
  };
}

/** Maps an error kind from api/client.js to its translation key. */
export const errorKeyFor = (kind) =>
  ({
    'not-found': 'errorNotFound',
    'bad-key': 'errorBadKey',
    'missing-key': 'errorMissingKey',
    'rate-limit': 'errorRateLimit',
    offline: 'errorOffline',
  })[kind] ?? 'errorUnknown';
