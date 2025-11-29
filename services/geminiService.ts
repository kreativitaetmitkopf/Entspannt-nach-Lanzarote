import { SearchParams, TravelOption, TransportMode, TravelPreference, BookingStep } from '../types';

/**
 * HILFSFUNKTIONEN FÜR URLS
 */
const getGoogleFlightsUrl = (origin: string, date: string) => {
  const originEncoded = encodeURIComponent(origin);
  // Wir suchen explizit nach Arrecife (ACE). Google Flights macht den Radius-Check automatisch bei Ortsnamen.
  return `https://www.google.com/travel/flights?q=Flights+from+${originEncoded}+to+Arrecife+Lanzarote+on+${date}+one+way`;
};

const getFerryUrl = () => "https://www.directferries.de/faehren_nach_lanzarote.htm";
const getTrainUrl = () => "https://www.bahn.de/";
const getBusUrl = () => "https://www.flixbus.de/";
const getCarUrl = () => "https://www.billiger-mietwagen.de/mietwagen-lanzarote-flughafen-ace.html"; // Specific ACE link

const getBlaBlaUrl = (origin: string, date: string) => {
  const originEncoded = encodeURIComponent(origin);
  // db = departure base (Start), dt = date
  return `https://www.blablacar.de/search?db=${originEncoded}&dt=${date}`;
};

// Google Maps Route vom Flughafen ACE zur angegebenen Unterkunft
const getRouteUrl = (accommodation: string) => {
  const destEncoded = encodeURIComponent(accommodation);
  return `https://www.google.com/maps/dir/Aeropuerto+César+Manrique-Lanzarote+(ACE),+Arrecife,+Spanien/${destEncoded}`;
};

/**
 * GENERATOR LOGIK
 */
export const generateTravelOptions = async (params: SearchParams): Promise<TravelOption[]> => {
  // Simulierte Ladezeit für das "Gefühl" einer Berechnung
  await new Promise(resolve => setTimeout(resolve, 1000));

  const options: TravelOption[] = [];
  const { modes, preference, origin, startDate, accommodation } = params;

  // Helper um Navigation zur Unterkunft hinzuzufügen
  const addArrivalStep = (steps: BookingStep[]) => {
    // 1. Mietwagen Check: Wenn User nicht schon "Mietwagen" als Hauptmodus gewählt hat, 
    // und auch kein eigenes Fahrzeug hat, empfehlen wir einen für die Insel.
    // Aber der User wollte spezifisch "Mietwagenbuchung von Lanzarote zur Unterkunft".
    // Also fügen wir es fast immer hinzu, außer er hat ein eigenes Auto dabei.
    
    if (!modes.includes(TransportMode.OWN_VEHICLE)) {
         steps.push({
            stepTitle: "Mietwagen für die Insel",
            providerName: "Billiger-Mietwagen (Abholung ACE)",
            bookingUrl: getCarUrl(),
            description: "Unverzichtbar für den Weg zur Unterkunft und Ausflüge. Übernahme direkt am Terminal."
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
        description: `Suche ab ${origin} und umliegenden Flughäfen (ca. 200km Radius). Ziel ist immer Arrecife (ACE).`
      }
    ];

    if (modes.includes(TransportMode.RIDESHARE)) {
      flightSteps.unshift({
        stepTitle: "Mitfahrgelegenheit zum Flughafen",
        providerName: "BlaBlaCar",
        bookingUrl: getBlaBlaUrl(origin, startDate),
        description: `Suche vorausgefüllt: Von ${origin}. Bitte geben Sie als Ziel Ihren gewählten Abflughafen ein.`
      });
    } else if (modes.includes(TransportMode.COACH)) {
       flightSteps.unshift({
        stepTitle: "Fernbus zum Flughafen",
        providerName: "FlixBus",
        bookingUrl: getBusUrl(),
        description: "Bequeme Anreise zum Abflughafen ohne Parkplatzgebühren."
      });
    }

    // Add local transport & navigation
    addArrivalStep(flightSteps);

    options.push({
      id: 'opt-flight',
      mode: TransportMode.FLIGHT,
      title: isComfort ? `Komfort-Flug nach Lanzarote` : `Flugangebote ab Region ${origin}`,
      duration: 'ca. 4.5 Stunden (reine Flugzeit)',
      priceEstimate: isCheap ? 'ab 120€ p.P.' : 'ab 300€ p.P.',
      stressLevel: isComfort ? 'Niedrig' : 'Mittel',
      routeDescription: `Starten Sie entspannt von einem Flughafen in Ihrer Nähe (${origin} + 200km). Ziel ist Arrecife (ACE). Dort nehmen Sie Ihren Mietwagen zur Unterkunft.`,
      stops: [`Start: ${origin} (Umkreis)`, 'Ziel: Arrecife (ACE)', `Unterkunft: ${accommodation || 'Lanzarote'}`],
      pros: ['Schnellste Anreise', 'Große Auswahl im DACH-Raum', 'Wettergarantie in wenigen Stunden'],
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
        providerName: "Deutsche Bahn (DB) / ÖBB / SBB",
        bookingUrl: getTrainUrl(),
        description: "Buchen Sie bis Südspanien (Huelva oder Cádiz). Tipp: Interrail-Pass für Senioren prüfen!"
      });
    } else if (modes.includes(TransportMode.COACH)) {
      landSteps.push({
        stepTitle: "Busreise nach Spanien",
        providerName: "FlixBus / ALSA",
        bookingUrl: getBusUrl(),
        description: "Kostengünstig bis Huelva oder Cádiz fahren."
      });
    }

    landSteps.push({
      stepTitle: "Fährüberfahrt (Kanaren)",
      providerName: "Direct Ferries",
      bookingUrl: getFerryUrl(),
      description: isComfort 
        ? "Wählen Sie Huelva oder Cádiz als Abfahrtsort. Ziel ist immer Arrecife (Lanzarote). Empfehlung: Außenkabine." 
        : "Buchung der Fähre: Abfahrt ab Huelva oder Cádiz wählen. Zielhafen: Arrecife."
    });

    // Add local transport & navigation
    addArrivalStep(landSteps);

    options.push({
      id: 'opt-slow',
      mode: modes.includes(TransportMode.TRAIN) ? TransportMode.TRAIN : TransportMode.FERRY,
      title: 'Entschleunigte Reise (Zug/Fähre)',
      duration: '2-3 Tage',
      priceEstimate: 'ab 250€ - 500€ p.P.',
      stressLevel: 'Niedrig',
      routeDescription: 'Eine Panoramareise durch den DACH-Raum, Frankreich und Spanien bis zum Fährhafen. Auf Lanzarote geht es per Mietwagen zur Unterkunft.',
      stops: ['Heimatbahnhof', 'Frankreich', 'Südspanien (Hafen)', 'Arrecife', `Unterkunft: ${accommodation || 'Insel'}`],
      pros: ['Kein Flugstress', 'Viel Gepäck möglich', 'Erlebnisreise durch Europa'],
      cons: ['Lange Reisezeit', 'Umstiege in Paris/Madrid'],
      bookingSteps: landSteps
    });
  }

  // --- OPTION 3: EIGENES FAHRZEUG / WOHNMOBIL ---
  if (modes.includes(TransportMode.OWN_VEHICLE) || (modes.includes(TransportMode.RENTAL_CAR) && !modes.includes(TransportMode.FLIGHT))) {
    
    const carSteps: BookingStep[] = [
        {
          stepTitle: "Fähre inkl. Fahrzeug buchen",
          providerName: "Direct Ferries",
          bookingUrl: getFerryUrl(),
          description: "Wichtig: Fahrzeugmaße angeben! Wählen Sie Abfahrt (Huelva/Cádiz) und Ziel (Arrecife)."
        },
        {
          stepTitle: "Routenplanung Festland",
          providerName: "ViaMichelin",
          bookingUrl: "https://www.viamichelin.de/",
          description: "Planen Sie Zwischenstopps in Frankreich und Spanien ein."
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
      routeDescription: `Starten Sie in ${origin}. Fahren Sie via Frankreich nach Huelva oder Cádiz (Spanien). Von dort mit der Fähre nach Arrecife und direkt zur Unterkunft.`,
      stops: [`Start: ${origin}`, 'Lyon/Bordeaux', 'Madrid/Sevilla', 'Fähre', 'Lanzarote'],
      pros: ['Maximale Flexibilität', 'Eigenes Fahrzeug auf der Insel', 'Ideal für Überwinterer'],
      cons: ['Mautgebühren', 'Hohe Fährkosten für Camper'],
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
          description: "Wir suchen ab Ihrem Standort nach Flügen."
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
      routeDescription: 'Die bewährte Kombination für Lanzarote.',
      stops: ['Start', 'Arrecife'],
      pros: ['Einfachste Anreise'],
      cons: [],
      bookingSteps: fallbackSteps
     });
  }

  return options.slice(0, 3);
};