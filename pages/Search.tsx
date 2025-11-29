import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { SearchParams, TravelPreference, TransportMode } from '../types';
import { MapPin, Calendar, Users, Caravan, Euro, Scale, Armchair, Info, Home as HomeIcon } from 'lucide-react';

interface SearchProps {
  setSearchParams: (params: SearchParams) => void;
}

export const Search: React.FC<SearchProps> = ({ setSearchParams }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loadingLoc, setLoadingLoc] = useState(false);
  
  const initialModes = location.state?.modes || [TransportMode.FLIGHT];

  const [formData, setFormData] = useState<SearchParams>({
    origin: '',
    accommodation: '', // New field
    startDate: new Date().toISOString().split('T')[0],
    flexibilityDays: 3,
    travelers: 2,
    hasCamper: false, 
    preference: TravelPreference.BALANCED,
    modes: initialModes
  });

  useEffect(() => {
    if (formData.modes.includes(TransportMode.OWN_VEHICLE)) {
      setFormData(prev => ({ ...prev, hasCamper: true }));
    }
  }, [formData.modes]);

  const handleGeoLocation = () => {
    setLoadingLoc(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setFormData(prev => ({ ...prev, origin: `Mein Standort` })); 
        setLoadingLoc(false);
      }, (error) => {
        alert("Standort konnte nicht ermittelt werden. Bitte geben Sie die Stadt manuell ein.");
        setLoadingLoc(false);
      });
    } else {
      setLoadingLoc(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    setSearchParams(formData);
    navigate('/results');
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-lanzarote-sky h-4 w-full">
          <div 
            className="bg-lanzarote-ocean h-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Selected Modes Info */}
        <div className="bg-lanzarote-sky px-8 py-2 border-b border-gray-200 flex items-center gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Gewählte Verkehrsmittel: <strong>{formData.modes.map(m => m.replace('_', ' ')).join(', ')}</strong></span>
        </div>

        <div className="p-8">
          {/* STEP 1: Ort */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-lanzarote-ocean flex items-center gap-3">
                <MapPin className="w-8 h-8" />
                Start & Ziel
              </h2>
              <p className="text-xl text-gray-600">Von wo reisen Sie an und wo wohnen Sie auf der Insel?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Ihr Startort (DACH-Raum):</label>
                  <input 
                    type="text" 
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    placeholder="z.B. München, Wien, Zürich..."
                    className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-lanzarote-ocean focus:ring-2 focus:ring-lanzarote-ocean focus:outline-none"
                  />
                  <button 
                    onClick={handleGeoLocation}
                    disabled={loadingLoc}
                    className="text-lanzarote-ocean font-bold flex items-center gap-2 hover:underline text-lg mt-2"
                  >
                    <MapPin className="w-5 h-5" />
                    {loadingLoc ? 'Ortung läuft...' : 'Meinen aktuellen Standort verwenden'}
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                    <HomeIcon className="w-5 h-5" /> Ihre Unterkunft auf Lanzarote (Optional):
                  </label>
                  <input 
                    type="text" 
                    value={formData.accommodation}
                    onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                    placeholder="z.B. Hotel Fariones, Costa Teguise, Calle..."
                    className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-lanzarote-ocean focus:ring-2 focus:ring-lanzarote-ocean focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">Wir erstellen Ihnen eine Route vom Flughafen zur Unterkunft.</p>
                </div>
              </div>

              <div className="pt-6">
                <Button onClick={nextStep} fullWidth disabled={!formData.origin}>
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Datum */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-lanzarote-ocean flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                Wann soll es losgehen?
              </h2>
              <p className="text-xl text-gray-600">Ungefähres Datum. Da Sie flexibel sind, schauen wir +/- einige Tage.</p>
              
              <div className="space-y-4">
                <label className="block text-lg font-bold">Frühester Start:</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-lanzarote-ocean focus:ring-2 focus:ring-lanzarote-ocean focus:outline-none"
                />
                
                <div className="bg-lanzarote-sky p-4 rounded-xl">
                  <label className="block text-lg font-bold mb-2">Wie flexibel sind Sie?</label>
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setFormData({...formData, flexibilityDays: Math.max(1, formData.flexibilityDays - 1)})}
                      className="w-12 h-12 bg-white rounded-full shadow text-2xl font-bold text-lanzarote-ocean"
                    >-</button>
                    <span className="text-2xl font-bold">+/- {formData.flexibilityDays} Tage</span>
                    <button 
                      onClick={() => setFormData({...formData, flexibilityDays: formData.flexibilityDays + 1})}
                      className="w-12 h-12 bg-white rounded-full shadow text-2xl font-bold text-lanzarote-ocean"
                    >+</button>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button variant="outline" onClick={prevStep} className="flex-1">Zurück</Button>
                <Button onClick={nextStep} className="flex-1">Weiter</Button>
              </div>
            </div>
          )}

          {/* STEP 3: Personen */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-lanzarote-ocean flex items-center gap-3">
                <Users className="w-8 h-8" />
                Wer reist mit?
              </h2>
              
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
                    <span className="text-xl font-bold">Anzahl Personen</span>
                    <select 
                      value={formData.travelers}
                      onChange={(e) => setFormData({...formData, travelers: Number(e.target.value)})}
                      className="p-2 text-xl font-bold border rounded-lg focus:outline-none focus:border-lanzarote-ocean"
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                 </div>

                 {/* Wohnmobil Hinweis - falls Own Vehicle gewählt wurde */}
                 {formData.modes.includes(TransportMode.OWN_VEHICLE) && (
                   <div 
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl border-lanzarote-ocean bg-lanzarote-sky`}
                   >
                      <div className={`w-8 h-8 rounded-full border-2 border-lanzarote-ocean bg-lanzarote-ocean flex items-center justify-center`}>
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                      <div>
                        <span className="text-xl font-bold flex items-center gap-2">
                          <Caravan className="w-6 h-6" />
                          Eigenes Fahrzeug/Wohnmobil
                        </span>
                        <p className="text-gray-600">Wir berücksichtigen Fähren für Fahrzeuge.</p>
                      </div>
                   </div>
                 )}
              </div>

              <div className="pt-6 flex gap-4">
                <Button variant="outline" onClick={prevStep} className="flex-1">Zurück</Button>
                <Button onClick={nextStep} className="flex-1">Weiter</Button>
              </div>
            </div>
          )}

          {/* STEP 4: Präferenzen */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-lanzarote-ocean flex items-center gap-3">
                <Scale className="w-8 h-8" />
                Was ist Ihnen wichtig?
              </h2>
              <p className="text-xl text-gray-600">Wir suchen die Angebote passend zu Ihrem Reisewunsch aus.</p>

              <div className="space-y-4">
                {/* Option 1: Günstig */}
                <div 
                  onClick={() => setFormData({...formData, preference: TravelPreference.CHEAPEST})}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.preference === TravelPreference.CHEAPEST ? 'border-lanzarote-ocean bg-[#5e6d5a]/10 ring-2 ring-lanzarote-ocean ring-opacity-50' : 'border-gray-200'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-stone-100 text-stone-700 rounded-full">
                        <Euro className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">So günstig wie möglich</h3>
                        <p className="text-gray-600">Preis hat Vorrang vor Dauer und Komfort.</p>
                      </div>
                   </div>
                </div>

                {/* Option 2: Ausgewogen */}
                <div 
                  onClick={() => setFormData({...formData, preference: TravelPreference.BALANCED})}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.preference === TravelPreference.BALANCED ? 'border-lanzarote-ocean bg-[#5e6d5a]/10 ring-2 ring-lanzarote-ocean ring-opacity-50' : 'border-gray-200'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-stone-100 text-stone-700 rounded-full">
                        <Scale className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Guter Mix (Preis & Komfort)</h3>
                        <p className="text-gray-600">Vernünftige Preise bei angenehmer Reisedauer.</p>
                      </div>
                   </div>
                </div>

                {/* Option 3: Komfort */}
                <div 
                  onClick={() => setFormData({...formData, preference: TravelPreference.COMFORT})}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.preference === TravelPreference.COMFORT ? 'border-lanzarote-ocean bg-[#5e6d5a]/10 ring-2 ring-lanzarote-ocean ring-opacity-50' : 'border-gray-200'}`}
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-stone-100 text-stone-700 rounded-full">
                        <Armchair className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">So bequem wie möglich</h3>
                        <p className="text-gray-600">Direktverbindungen, bester Komfort, weniger Stress.</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button variant="outline" onClick={prevStep} className="flex-1">Zurück</Button>
                <Button onClick={handleSubmit} className="flex-1">Angebote suchen</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};