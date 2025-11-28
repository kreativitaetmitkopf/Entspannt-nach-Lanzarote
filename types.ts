export enum TransportMode {
  FLIGHT = 'FLUG',
  TRAIN = 'ZUG',
  FERRY = 'FAEHRE',
  RIDESHARE = 'MITFAHRGELEGENHEIT',
  RENTAL_CAR = 'MIETWAGEN',
  OWN_VEHICLE = 'EIGENES_FAHRZEUG' // Auto oder Wohnmobil
}

export enum TravelPreference {
  CHEAPEST = 'Guenstig',
  BALANCED = 'Preis_Leistung',
  COMFORT = 'Komfort'
}

export interface BookingStep {
  stepTitle: string;
  providerName: string;
  bookingUrl: string;
  description: string;
}

export interface TravelOption {
  id: string;
  mode: TransportMode;
  title: string;
  duration: string;
  priceEstimate: string;
  stressLevel: 'Niedrig' | 'Mittel' | 'Hoch';
  routeDescription: string;
  stops: string[];
  pros: string[];
  cons: string[];
  bookingSteps: BookingStep[];
}

export interface SearchParams {
  origin: string;
  startDate: string;
  flexibilityDays: number; // +/- days
  travelers: number;
  hasCamper: boolean;
  preference: TravelPreference;
  modes: TransportMode[]; // Liste der gewählten Verkehrsmittel
}