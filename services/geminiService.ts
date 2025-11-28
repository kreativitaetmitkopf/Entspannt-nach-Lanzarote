import { GoogleGenAI, Type } from "@google/genai";
import { SearchParams, TravelOption, TransportMode, TravelPreference } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTravelOptions = async (params: SearchParams): Promise<TravelOption[]> => {
  const model = "gemini-2.5-flash";
  
  // Convert selected modes to a string for the prompt
  const selectedModesString = params.modes.map(m => m).join(', ');

  const prompt = `
    Du bist ein erfahrener Reisebüromitarbeiter für Best Ager (Senioren).
    Ziel: Lanzarote. Start: ${params.origin}.
    Reisezeitraum: Ab ${params.startDate} (+/- ${params.flexibilityDays} Tage).
    Reisende: ${params.travelers}.
    
    DER KUNDE MÖCHTE AUSSCHLIESSLICH FOLGENDE VERKEHRSMITTEL NUTZEN: ${selectedModesString}.
    Bitte generiere NUR Reiseoptionen, die diese Verkehrsmittel nutzen (oder sinnvolle Kombinationen daraus, z.B. Zug zum Flughafen wenn Zug & Flug gewählt).
    
    REISE-STIL: ${params.preference}
    - CHEAPEST: Billigste Route, Komfort egal.
    - BALANCED: Guter Mix.
    - COMFORT: Bequemste Route (Direktflüge, Kabinen, Taxi).

    Erstelle genau 3 unterschiedliche Optionen basierend auf der Auswahl.
    Wenn z.B. nur "Zug" und "Fähre" gewählt ist, zeige NUR Zug+Fähre Optionen.
    Wenn "Mitfahrgelegenheit" gewählt ist, suche nach BlaBlaCar Optionen zum nächsten großen Hub (Flughafen/Hafen).
    Wenn "Mietwagen" gewählt ist, zeige eine Fly & Drive Option oder Mietwagen ab Festland (wenn realistisch).
    Wenn "Eigenes Fahrzeug" gewählt ist, zeige die Fährroute ab Huelva/Cadiz.
    Wenn "Reisebus" gewählt ist, suche nach Fernbus-Verbindungen (FlixBus, ALSA) zum Flughafen oder Hafen (z.B. Bus nach Huelva + Fähre).
    
    WICHTIG - BUCHUNGSSCHRITTE (bookingSteps):
    Erstelle konkrete Anleitungen mit Links:
    - FLUG: Google Flights Link mit Startort "${params.origin}" (oder Flughäfen in 200km Nähe). 
      URL: "https://www.google.com/travel/flights?q=Flights+from+${params.origin}+to+Lanzarote+on+${params.startDate}"
    - ZUG: bahn.de, thetrainline.com
    - REISEBUS: flixbus.de, alsa.es
    - FÄHRE: directferries.com, navieraarmas.com, fredolsen.es
    - MITFAHRGELEGENHEIT: blablacar.de (Suche nach Fahrt zum Flughafen/Hafen)
    - MIETWAGEN: billiger-mietwagen.de, check24.de/mietwagen

    Gib realistische Preise und Dauern an.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              mode: { type: Type.STRING, enum: Object.values(TransportMode) },
              title: { type: Type.STRING },
              duration: { type: Type.STRING },
              priceEstimate: { type: Type.STRING },
              stressLevel: { type: Type.STRING, enum: ['Niedrig', 'Mittel', 'Hoch'] },
              routeDescription: { type: Type.STRING },
              stops: { type: Type.ARRAY, items: { type: Type.STRING } },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              bookingSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepTitle: { type: Type.STRING },
                    providerName: { type: Type.STRING },
                    bookingUrl: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['stepTitle', 'providerName', 'bookingUrl', 'description']
                }
              }
            },
            required: ['id', 'mode', 'title', 'duration', 'priceEstimate', 'stressLevel', 'routeDescription', 'stops', 'pros', 'cons', 'bookingSteps']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as TravelOption[];
    }
    throw new Error("Keine Daten empfangen");
  } catch (error) {
    console.error("Fehler bei der Gemini Anfrage:", error);
    return [
      {
        id: 'error-1',
        mode: TransportMode.FLIGHT,
        title: 'Systemfehler - Bitte später versuchen',
        duration: 'N/A',
        priceEstimate: 'N/A',
        stressLevel: 'Mittel',
        routeDescription: 'Es konnte keine Verbindung abgerufen werden.',
        stops: [],
        pros: [],
        cons: [],
        bookingSteps: []
      }
    ];
  }
};