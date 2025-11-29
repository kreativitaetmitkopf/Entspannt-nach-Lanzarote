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
const getCarUrl = () => "https://www.billiger-mietwagen.de/";
const getBlaBlaUrl = () => "https://www.blablacar.de/";

/**
 * GENERATOR LOGIK
 * Statt einer KI nutzen wir hier feste Logik-Bausteine, die basierend auf den User-Eingaben
 * (Ort, Datum, Modus, Präferenz) zusammengesetzt werden.
 */
export const generateTravelOptions = async (params: SearchParams): Promise<TravelOption[]> => {
  // Simulierte Ladezeit für das "Gefühl" einer Berechnung
  await new Promise(resolve => setTimeout(resolve, 1000));

  const options: TravelOption[] = [];
  const { modes, preference, origin, startDate } = params;

  // --- OPTION 1: FLUG (Wenn ausgewählt) ---
  if (modes.includes(TransportMode.FLIGHT)) {
    const isComfort = preference === TravelPreference.COMFORT;
    const isCheap = preference === TravelPreference.CHEAPEST;

    const flightSteps: BookingStep[] = [
      {
        stepTitle: "Flugvergleich (DACH & Umkreis)",
        providerName: "Google Flights",
        bookingUrl: getGoogleFlightsUrl(origin, startDate),
        description: `Suche ab ${origin} und umliegenden Flughäfen (ca. 200km Radius). Prüfen Sie auch Abflüge ab Frankfurt, München, Zürich oder Wien.`
      }
    ];

    if (modes.includes(TransportMode.RENTAL_CAR)) {
      flightSteps.push({
        stepTitle: "Mietwagen am Flughafen ACE",
        providerName: "Billiger-Mietwagen",
        bookingUrl: getCarUrl(),
        description: "Empfehlung: Kleinwagen für die Insel genügt. Übernahme direkt am Terminal Arrecife."
      });
    }

    if (modes.includes(TransportMode.RIDESHARE)) {
      flightSteps.unshift({
        stepTitle: "Zubringer zum Flughafen",
        providerName: "BlaBlaCar",
        bookingUrl: getBlaBlaUrl(),
        description: `Finden Sie eine Mitfahrgelegenheit von ${origin} zum nächstgelegenen großen Flughafen.`
      });
    } else if (modes.includes(TransportMode.COACH)) {
       flightSteps.unshift({
        stepTitle: "Fernbus zum Flughafen",
        providerName: "FlixBus",
        bookingUrl: getBusUrl(),
        description: "Bequeme Anreise zum Abflughafen ohne Parkplatzgebühren."
      });
    }

    options.push({
      id: 'opt-flight',
      mode: TransportMode.FLIGHT,
      title: isComfort ? `Komfort-Flug nach Lanzarote` : `Flugangebote ab Region ${origin}`,
      duration: 'ca. 4.5 Stunden (reine Flugzeit)',
      priceEstimate: isCheap ? 'ab 120€ p.P.' : 'ab 300€ p.P.',
      stressLevel: isComfort ? 'Niedrig' : 'Mittel',
      routeDescription: `Starten Sie entspannt von einem Flughafen in Ihrer Nähe (${origin} + 200km). Ziel ist immer Arrecife (ACE). Wir vergleichen Linienflüge und Charter.`,
      stops: [`Start: ${origin} (Umkreis)`, 'Ziel: Arrecife (ACE)'],
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
      description: isComfort ? "Empfehlung: Außenkabine für die 27-30 Std. Überfahrt buchen." : "Fähre ab Huelva oder Cádiz nach Arrecife."
    });

    options.push({
      id: 'opt-slow',
      mode: modes.includes(TransportMode.TRAIN) ? TransportMode.TRAIN : TransportMode.FERRY,
      title: 'Entschleunigte Reise (Zug/Fähre)',
      duration: '2-3 Tage',
      priceEstimate: 'ab 250€ - 500€ p.P.',
      stressLevel: 'Niedrig',
      routeDescription: 'Eine Panoramareise durch den DACH-Raum, Frankreich und Spanien bis zum Fährhafen. Der Weg ist das Ziel.',
      stops: ['Heimatbahnhof', 'Frankreich', 'Südspanien (Hafen)', 'Arrecife'],
      pros: ['Kein Flugstress', 'Viel Gepäck möglich', 'Erlebnisreise durch Europa'],
      cons: ['Lange Reisezeit', 'Umstiege in Paris/Madrid'],
      bookingSteps: landSteps
    });
  }

  // --- OPTION 3: EIGENES FAHRZEUG / WOHNMOBIL ---
  if (modes.includes(TransportMode.OWN_VEHICLE) || (modes.includes(TransportMode.RENTAL_CAR) && !modes.includes(TransportMode.FLIGHT))) {
    options.push({
      id: 'opt-caravan',
      mode: TransportMode.OWN_VEHICLE,
      title: 'Mit dem eigenen Auto/Wohnmobil',
      duration: '3-5 Tage (gemütlich)',
      priceEstimate: 'Fähre ca. 400-900€ (inkl. KFZ)',
      stressLevel: 'Mittel',
      routeDescription: `Starten Sie in ${origin}. Fahren Sie via Frankreich nach Huelva oder Cádiz (Spanien). Von dort geht die Fähre direkt nach Arrecife.`,
      stops: [`Start: ${origin}`, 'Lyon/Bordeaux', 'Madrid/Sevilla', 'Fähre', 'Lanzarote'],
      pros: ['Maximale Flexibilität', 'Eigenes Fahrzeug auf der Insel', 'Ideal für Überwinterer'],
      cons: ['Mautgebühren', 'Hohe Fährkosten für Camper'],
      bookingSteps: [
        {
          stepTitle: "Fähre inkl. Fahrzeug buchen",
          providerName: "Direct Ferries",
          bookingUrl: getFerryUrl(),
          description: "Wichtig: Fahrzeugmaße genau angeben! Strecke: Huelva-Arrecife oder Cádiz-Arrecife."
        },
        {
          stepTitle: "Routenplanung",
          providerName: "ViaMichelin / ADAC",
          bookingUrl: "https://www.viamichelin.de/",
          description: "Planen Sie Zwischenstopps in Frankreich und Spanien ein."
        }
      ]
    });
  }

  // Fallback
  if (options.length === 0) {
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
      bookingSteps: [
         {
          stepTitle: "Flug buchen",
          providerName: "Google Flights",
          bookingUrl: getGoogleFlightsUrl(origin, startDate),
          description: "Wir suchen ab Ihrem Standort nach Flügen."
        },
        {
          stepTitle: "Mietwagen buchen",
          providerName: "Billiger-Mietwagen",
          bookingUrl: getCarUrl(),
          description: "Abholung am Flughafen ACE."
        }
      ]
     });
  }

  return options.slice(0, 3);
};