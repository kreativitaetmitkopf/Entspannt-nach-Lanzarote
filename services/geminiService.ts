import { SearchParams, TravelOption, TransportMode, TravelPreference, BookingStep } from '../types';

/**
 * --- AFFILIATE KONFIGURATION ---
 * Hier tragen Sie Ihre Partner-Links ein.
 * Wenn Sie bei einem Partnerprogramm (z.B. Awin, TradeTracker, CJ) sind,
 * ersetzen Sie die untenstehenden URLs durch Ihre Tracking-Links.
 */
const AFFILIATE_CONFIG = {
  // Google Flights hat kein klassisches Affiliate Programm, bleibt direkt.
  FLIGHTS_BASE: "https://www.google.com/travel/flights",
  
  // Direct Ferries Tracking Link (Prio 1 für den Verein)
  FERRY_HUELVA: "https://www.directferries.de/?dfpid=6994&affid=1&rurl=huelva_arrecife_faehre.htm",
  FERRY_CADIZ: "https://www.directferries.de/cadiz_arrecife_faehre.htm",
  
  // Bahn Affiliate Link (z.B. via Awin oder Tradedoubler)
  TRAIN_BASE: "https://www.bahn.de/", 
  
  // Flixbus Partnerlink
  BUS_BASE: "https://www.flixbus.de/",
  
  // Mietwagen (z.B. Check24 oder Billiger-Mietwagen Partnerlink)
  // Tipp: Nutzen Sie einen Deeplink, der direkt auf Arrecife (ACE) zeigt.
  CAR_RENTAL: "https://www.billiger-mietwagen.de/mietwagen-lanzarote-flughafen-ace.html",
  
  // BlaBlaCar Partnerlink
  BLABLACAR: "https://www.blablacar.de/"
};

/**
 * HILFSFUNKTIONEN FÜR URLS
 */

const getGoogleFlightsUrl = (origin: string, date: string) => {
  const originEncoded = encodeURIComponent(origin);
  // Wir suchen explizit nach Arrecife (ACE).
  return `${AFFILIATE_CONFIG.FLIGHTS_BASE}?q=Flights+from+${originEncoded}+to+Arrecife+Lanzarote+on+${date}+one+way`;
};

// Intelligente Fähr-URL basierend auf der Route
const getFerryUrl = (preferredPort: 'HUELVA' | 'CADIZ' = 'HUELVA') => {
  // Hier könnten Sie Logik einbauen, um Tracking-Parameter anzuhängen
  if (preferredPort === 'CADIZ') return AFFILIATE_CONFIG.FERRY_CADIZ;
  return AFFILIATE_CONFIG.FERRY_HUELVA;
};

const getTrainUrl = () => AFFILIATE_CONFIG.TRAIN_BASE;
const getBusUrl = () => AFFILIATE_CONFIG.BUS_BASE;
const getCarUrl = () => AFFILIATE_CONFIG.CAR_RENTAL;

const getBlaBlaUrl = (origin: string, date: string) => {
  const originEncoded = encodeURIComponent(origin);
  // Wenn Ihr Affiliate Link Parameter erlaubt, hängen Sie sie hier an.
  // Einfache Suche:
  return `${AFFILIATE_CONFIG.BLABLACAR}search?db=${originEncoded}&dt=${date}`;
};

// Google Maps Route vom Flughafen ACE zur angegebenen Unterkunft (Kein Affiliate, reiner Service)
const getRouteUrl = (accommodation: string) => {
  const destEncoded = encodeURIComponent(accommodation);
  return `https://www.google.com/maps/dir/Aeropuerto+César+Manrique-Lanzarote+(ACE),+Arrecife,+Spanien/${destEncoded}`;
};

/**
 * GENERATOR LOGIK
 */
export const generateTravelOptions = async (params: SearchParams): Promise<TravelOption[]> => {
  // Simulierte Ladezeit
  await new Promise(resolve => setTimeout(resolve, 800));

  const options: TravelOption[] = [];
  const { modes, preference, origin, startDate, accommodation } = params;

  // Helper um Navigation zur Unterkunft hinzuzufügen
  const addArrivalStep = (steps: BookingStep[]) => {
    // 1. Mietwagen Check
    if (!modes.includes(TransportMode.OWN_VEHICLE)) {
         steps.push({
            stepTitle: "Mietwagen für die Insel",
            providerName: "Billiger-Mietwagen (Abholung ACE)",
            bookingUrl: getCarUrl(),
            description: "Unverzichtbar für den Weg zur Unterkunft. Wenn Sie über diesen Link buchen, unterstützen Sie unseren Verein."
          });
    }

    // 2. Navigation
    if (accommodation) {
      steps.push({
        stepTitle: "Ankunft: Fahrt zur Unterkunft",
        providerName: "Google Maps Navigation",
        bookingUrl: getRouteUrl(accommodation),
        description: `Route vom Flughafen Arrecife zu Ihrer Adresse: ${accommodation}.`,
        isNavigation: true
      });
    }
  };

  // --- OPTION 1: FLUG (Wenn ausgewählt) ---
  if (modes.includes(TransportMode.FLIGHT)) {
    const isComfort = preference === TravelPreference.COMFORT;
    const isCheap = preference === TravelPreference.CHEAPEST;

    const flightSteps: BookingStep[] = [
      {
        stepTitle: "Flugvergleich (DACH & Umkreis)",
        providerName: "Google Flights",
        bookingUrl: getGoogleFlightsUrl(origin, startDate),
        description: `Suche ab ${origin} und Umgebung (200km Radius). Ziel ist Arrecife (ACE).`
      }
    ];

    if (modes.includes(TransportMode.RIDESHARE)) {
      flightSteps.unshift({
        stepTitle: "Mitfahrgelegenheit zum Flughafen",
        providerName: "BlaBlaCar",
        bookingUrl: getBlaBlaUrl(origin, startDate),
        description: `Günstig zum Flughafen. Geben Sie als Ziel Ihren Abflughafen ein.`
      });
    } else if (modes.includes(TransportMode.COACH)) {
       flightSteps.unshift({
        stepTitle: "Fernbus zum Flughafen",
        providerName: "FlixBus",
        bookingUrl: getBusUrl(),
        description: "Bequeme Anreise zum Abflughafen ohne Parkgebühren."
      });
    }

    addArrivalStep(flightSteps);

    options.push({
      id: 'opt-flight',
      mode: TransportMode.FLIGHT,
      title: isComfort ? `Komfort-Flug nach Lanzarote` : `Flugangebote ab Region ${origin}`,
      duration: 'ca. 4.5 Stunden (reine Flugzeit)',
      priceEstimate: isCheap ? 'ab 120€ p.P.' : 'ab 300€ p.P.',
      stressLevel: isComfort ? 'Niedrig' : 'Mittel',
      routeDescription: `Starten Sie entspannt von einem Flughafen in Ihrer Nähe (${origin} + 200km). Ziel ist Arrecife (ACE).`,
      stops: [`Start: ${origin}`, 'Ziel: Arrecife (ACE)', `Unterkunft: ${accommodation || 'Lanzarote'}`],
      pros: ['Schnellste Anreise', 'Große Auswahl', 'Wettergarantie in wenigen Stunden'],
      cons: ['Gepäckbeschränkungen', 'Transfer zum Flughafen nötig'],
      bookingSteps: flightSteps
    });
  }

  // --- OPTION 2: ZUG & FÄHRE (Slow Travel) ---
  if (modes.includes(TransportMode.TRAIN) || modes.includes(TransportMode.FERRY) || modes.includes(TransportMode.COACH)) {
    const isComfort = preference === TravelPreference.COMFORT;
    
    const landSteps: BookingStep[] = [];
    
    if (modes.includes(TransportMode.TRAIN)) {
      landSteps.push({
        stepTitle: "Zug durch Europa",
        providerName: "Deutsche Bahn / Partner",
        bookingUrl: getTrainUrl(),
        description: "Buchen Sie bis Südspanien (Huelva oder Cádiz)."
      });
    } else if (modes.includes(TransportMode.COACH)) {
      landSteps.push({
        stepTitle: "Busreise nach Spanien",
        providerName: "FlixBus / ALSA",
        bookingUrl: getBusUrl(),
        description: "Kostengünstig bis Huelva oder Cádiz fahren."
      });
    }

    // Wir geben beide Fähr-Optionen zur Auswahl oder entscheiden basierend auf Logik
    landSteps.push({
      stepTitle: "Fährüberfahrt (Route Huelva)",
      providerName: "Direct Ferries",
      bookingUrl: getFerryUrl('HUELVA'),
      description: "Beliebte Route ab Huelva nach Arrecife. Dauer ca. 27-30 Std."
    });

    addArrivalStep(landSteps);

    options.push({
      id: 'opt-slow',
      mode: modes.includes(TransportMode.TRAIN) ? TransportMode.TRAIN : TransportMode.FERRY,
      title: 'Entschleunigte Reise (Zug/Fähre)',
      duration: '2-3 Tage',
      priceEstimate: 'ab 250€ - 500€ p.P.',
      stressLevel: 'Niedrig',
      routeDescription: 'Eine Panoramareise durch Europa bis zum Fährhafen Huelva oder Cádiz.',
      stops: ['Heimatbahnhof', 'Frankreich', 'Südspanien (Hafen)', 'Arrecife'],
      pros: ['Kein Flugstress', 'Viel Gepäck möglich', 'Erlebnisreise'],
      cons: ['Lange Reisezeit'],
      bookingSteps: landSteps
    });
  }

  // --- OPTION 3: EIGENES FAHRZEUG / WOHNMOBIL ---
  if (modes.includes(TransportMode.OWN_VEHICLE) || (modes.includes(TransportMode.RENTAL_CAR) && !modes.includes(TransportMode.FLIGHT))) {
    
    const carSteps: BookingStep[] = [
        {
          stepTitle: "Fähre inkl. Fahrzeug buchen",
          providerName: "Direct Ferries",
          bookingUrl: getFerryUrl('HUELVA'), // Standard Huelva mit Tracking
          description: "Wichtig: Fahrzeugmaße im Formular angeben! Route: Huelva -> Arrecife."
        },
        {
          stepTitle: "Alternative: Fähre ab Cádiz",
          providerName: "Direct Ferries",
          bookingUrl: getFerryUrl('CADIZ'),
          description: "Prüfen Sie auch Abfahrten ab Cádiz nach Arrecife (Naviera Armas / Trasmediterranea)."
        }
    ];

    if (accommodation) {
        carSteps.push({
            stepTitle: "Ankunft: Fahrt zur Unterkunft",
            providerName: "Google Maps Navigation",
            bookingUrl: getRouteUrl(accommodation),
            description: `Route vom Fährhafen Arrecife zu Ihrer Adresse: ${accommodation}.`,
            isNavigation: true
        });
    }

    options.push({
      id: 'opt-caravan',
      mode: TransportMode.OWN_VEHICLE,
      title: 'Mit dem eigenen Auto/Wohnmobil',
      duration: '3-5 Tage (gemütlich)',
      priceEstimate: 'Fähre ca. 400-900€ (inkl. KFZ)',
      stressLevel: 'Mittel',
      routeDescription: `Starten Sie in ${origin}. Via Frankreich nach Huelva oder Cádiz (Spanien). Fähre nach Arrecife.`,
      stops: [`Start: ${origin}`, 'Spanien (Hafen)', 'Fähre', 'Lanzarote'],
      pros: ['Maximale Flexibilität', 'Eigenes Fahrzeug', 'Ideal für Überwinterer'],
      cons: ['Mautgebühren', 'Fährkosten'],
      bookingSteps: carSteps
    });
  }

  // Fallback
  if (options.length === 0) {
     const fallbackSteps: BookingStep[] = [
         {
          stepTitle: "Flug buchen",
          providerName: "Google Flights",
          bookingUrl: getGoogleFlightsUrl(origin, startDate),
          description: "Suche ab Ihrem Standort."
        }
      ];
      addArrivalStep(fallbackSteps);

     options.push({
      id: 'opt-fallback',
      mode: TransportMode.FLIGHT,
      title: 'Klassisch: Flug & Mietwagen',
      duration: '5 Std.',
      priceEstimate: 'Variabel',
      stressLevel: 'Niedrig',
      routeDescription: 'Die bewährte Kombination.',
      stops: ['Start', 'Arrecife'],
      pros: ['Einfachste Anreise'],
      cons: [],
      bookingSteps: fallbackSteps
     });
  }

  return options.slice(0, 3);
};